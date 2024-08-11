use biblatex::{Bibliography, Chunk, Date, DateValue, Entry, EntryType, PermissiveType, Spanned};
use regex::Regex;
use serde::Deserialize;
use std::fs;
use std::io::{self, BufReader, Read, Write};
use std::path::Path;
use utils::BiblatexUtils;
use validation::Metadata;

mod utils;
mod validation;

/// Prepyrus is a tool for verifying and processing MDX files
/// that contain citations in Chicago author-date style.
/// The tool reads a bibliography file in BibTeX format and
/// verifies the citations in the MDX files against the bibliography.
/// If the citations are valid, the tool processes the MDX files
/// by adding a bibliography section at the end of the file.
/// It also adds author, editor, and contributor from the MDX file metadata if available.
/// Finally, it also adds a notes heading at the end if footnotes are present in the file.
///
/// Arguments: `<bibliography.bib> <target_dir_or_file> <mode>`
///
/// The tool has two modes: `verify` and `process`.
///
/// In `verify` mode, the tool only verifies the citations in the MDX files
/// and matches them against the bibliography.  
/// In `process` mode, the tool _additionally_ processes the MDX files by injecting bibliography
/// and other details into the MDX files.
fn main() {
    let args: Vec<String> = std::env::args().collect();
    verify_arguments(&args);

    let exceptions = vec![
        "src/pages/contributing/",
        "src/pages/privacy.mdx",
        "src/pages/terms.mdx",
        "src/pages/team.mdx",
        "src/pages/acknowledgements.mdx",
        "src/pages/index.mdx",
        "src/pages/_app.mdx",
    ]
    .iter()
    .map(|&s| s.to_string())
    .collect::<Vec<String>>();

    let mdx_paths_raw = extract_mdx_paths(&args[2]).unwrap();
    let mdx_paths = filter_mdx_paths_for_exceptions(mdx_paths_raw, exceptions);

    let src = fs::read_to_string(&args[1]).unwrap();
    let bibliography = Bibliography::parse(&src).unwrap();
    let all_entries = bibliography.into_vec();

    // Phase 1: Verify MDX files
    validation::verify_mdx_files(mdx_paths.clone(), &all_entries);

    // Phase 2: Process MDX files (requires arg[3] mode to be set to "process")
    if args[3].eq("process") {
        for mdx_path in mdx_paths {
            process_mdx_file(&mdx_path, &all_entries);
        }
        println!("===Processing OK");
    }

    println!("===Prepyrus completed successfully!");
}

fn verify_arguments(args: &Vec<String>) {
    if args.len() < 4 {
        eprintln!("Arguments missing: <bibliography.bib> <target_dir_or_file> <mode>");
        std::process::exit(1);
    }
    if !args[1].ends_with(".bib") {
        eprintln!("Invalid file format. Please provide a file with .bib extension.");
        std::process::exit(1);
    }
    let target_arg = &args[2];
    if !Path::new(target_arg).is_dir() && !target_arg.ends_with(".mdx") {
        eprintln!("Invalid target. Please provide a directory or a single MDX file.");
        std::process::exit(1);
    }
    if !args[3].eq("verify") && !args[3].eq("process") {
        eprintln!("Invalid mode. Please provide either 'verify' or 'process'.");
        std::process::exit(1);
    }
}

// todo : arg should be a struct based on {path, metadata, markdown_content, full_file_content} as well as all_bib_entries
// todo : then we skip reading and checking its article, we just work from the structs
fn process_mdx_file(path: &str, all_bib_entries: &Vec<Entry>) {
    let (metadata, markdown_content, full_file_content) = match read_mdx_file(path) {
        Ok(data) => data,
        Err(err) => {
            if err.kind() == io::ErrorKind::InvalidData {
                eprintln!("Invalid MDX data format: {}", err);
                std::process::exit(1);
            } else {
                eprintln!("Unexpected error reading MDX file: {}", err);
                std::process::exit(1);
            }
        }
    };

    if !metadata.is_article {
        return;
    }

    let citations = extract_citations_from_markdown(&markdown_content);
    let citations_set = create_citations_set(citations);

    println!("No of unique citations: {:?}", citations_set.len());

    let mut mdx_payload = String::new();
    let mut mdx_bibliography = String::new();

    if !citations_set.is_empty() {
        let matched_citations =
            match match_citations_to_bibliography(citations_set, &all_bib_entries) {
                Ok(data) => data,
                Err(err) => {
                    eprintln!("Error matching citations to bibliography: {}", err);
                    std::process::exit(1);
                }
            };
        mdx_bibliography = generate_mdx_bibliography(matched_citations);
    }

    let mdx_authors = generate_mdx_authors(&metadata);
    let mdx_notes_heading = generate_notes_heading(&markdown_content);

    if !mdx_bibliography.is_empty() {
        mdx_payload.push_str(&mdx_bibliography);
    }
    if !mdx_authors.is_empty() {
        mdx_payload.push_str(&mdx_authors);
    }
    if !mdx_notes_heading.is_empty() {
        mdx_payload.push_str(&mdx_notes_heading);
    }
    if mdx_payload.is_empty() {
        return;
    }

    let updated_markdown_content = format!("{}\n{}", full_file_content, mdx_payload);

    match write_html_to_mdx_file(path, &updated_markdown_content) {
        Ok(_) => println!("Success! HTML bibliography injected for {}", path),
        Err(err) => {
            eprintln!("Error writing HTML to MDX file: {}", err);
            std::process::exit(1);
        }
    }
}

/// Excavates all MDX files in a directory and its subdirectories
/// and returns a vector of paths to the MDX files.
/// The function skips the "contributing" folder.
fn extract_mdx_paths(path: &str) -> io::Result<Vec<String>> {
    let mut mdx_paths = Vec::new();

    if !Path::new(path).is_dir() && path.ends_with(".mdx") {
        mdx_paths.push(path.to_string());
        return Ok(mdx_paths);
    }

    let entries = fs::read_dir(path)?;

    for entry in entries {
        let entry = entry?;
        let path = entry.path();

        if path.is_dir() {
            if path.file_name() == Some(std::ffi::OsStr::new("contributing")) {
                continue; // Skip the "contributing" folder
            }
            let sub_paths = extract_mdx_paths(path.to_str().unwrap())?;
            mdx_paths.extend(sub_paths);
        } else if path.is_file() && path.extension() == Some(std::ffi::OsStr::new("mdx")) {
            mdx_paths.push(path.to_str().unwrap().to_string());
        }
    }
    if mdx_paths.is_empty() {
        return Err(io::Error::new(
            io::ErrorKind::NotFound,
            "No MDX files found in the directory",
        ));
    }
    Ok(mdx_paths)
}

fn filter_mdx_paths_for_exceptions(mdx_paths: Vec<String>, exceptions: Vec<String>) -> Vec<String> {
    let mut filtered_paths = Vec::new();
    for path in mdx_paths {
        if !exceptions.contains(&path) {
            filtered_paths.push(path);
        }
    }
    filtered_paths
}

fn write_html_to_mdx_file(path: &str, content: &str) -> io::Result<()> {
    let file = fs::File::create(path)?;
    let mut writer = io::BufWriter::new(file);
    writer.write_all(content.as_bytes())?;
    Ok(())
}

fn generate_mdx_bibliography(entries: Vec<Entry>) -> String {
    let mut mdx_html = String::new();

    mdx_html.push_str("\n## Bibliography\n\n<div className=\"text-sm\">\n");

    for entry in entries {
        mdx_html.push_str("- ");
        match entry.entry_type {
            EntryType::Book => {
                let author = entry.author().unwrap();
                let title_spanned: &[biblatex::Spanned<biblatex::Chunk>] = entry.title().unwrap();
                let title = BiblatexUtils::extract_spanned_chunk(title_spanned);
                let publisher_spanned: Vec<Vec<Spanned<Chunk>>> = entry.publisher().unwrap();
                let publisher = BiblatexUtils::extract_publisher(&publisher_spanned);
                let address_spanned: &[Spanned<Chunk>] = entry.address().unwrap();
                let address = BiblatexUtils::extract_spanned_chunk(address_spanned);
                let date = entry.date().unwrap();
                let year = BiblatexUtils::extract_year(&date, entry.key.clone()).unwrap();
                let translators = entry.translator().unwrap_or(Vec::new());

                if author.len() > 2 {
                    mdx_html.push_str(&format!(
                        "{}, {} et al. ",
                        author[0].name, author[0].given_name
                    ));
                } else if author.len() == 2 {
                    mdx_html.push_str(&format!(
                        "{}, {} and {}, {}. ",
                        author[0].name, author[0].given_name, author[1].name, author[1].given_name
                    ));
                } else {
                    mdx_html.push_str(&format!("{}, {}. ", author[0].name, author[0].given_name));
                }
                mdx_html.push_str(&format!("{}. ", year));
                mdx_html.push_str(&format!("_{}_. ", title));

                let translators_mdx = generate_contributors(translators, "Translated".to_string());
                if !translators_mdx.is_empty() {
                    mdx_html.push_str(&translators_mdx);
                }

                mdx_html.push_str(&format!("{}: {}.", address, publisher));
            }
            _ => println!("Entry type not supported: {:?}", entry.entry_type),
        }
        mdx_html.push_str("\n");
    }

    mdx_html.push_str("</div>\n");

    mdx_html = mdx_html.replace("..", ".");
    mdx_html = mdx_html.replace("...", ".");
    mdx_html = mdx_html.replace("....", ".");

    mdx_html
}

fn generate_contributors(
    contributors: Vec<biblatex::Person>,
    contributor_description: String,
) -> String {
    let mut contributors_str = String::new();
    if contributors.len() > 1 {
        contributors_str.push_str(&format!("{} by ", contributor_description));
        for (i, person) in contributors.iter().enumerate() {
            if i == contributors.len() - 1 {
                contributors_str.push_str(&format!("and {} {}. ", person.given_name, person.name));
            } else {
                contributors_str.push_str(&format!("{} {}, ", person.given_name, person.name));
            }
        }
    } else if contributors.len() == 1 {
        contributors_str.push_str(&format!(
            "{} by {} {}. ",
            contributor_description, contributors[0].given_name, contributors[0].name
        ));
    }
    contributors_str
}

fn generate_mdx_authors(metadata: &Metadata) -> String {
    let mut mdx_html = String::new();

    if let Some(authors) = &metadata.authors {
        mdx_html.push_str("\n**Authors**  \n");
        mdx_html.push_str(&authors);
        mdx_html.push_str("\n");
    }
    if let Some(editors) = &metadata.editors {
        mdx_html.push_str("\n**Editors**  \n");
        mdx_html.push_str(&editors);
        mdx_html.push_str("\n");
    }
    if let Some(contributors) = &metadata.contributors {
        mdx_html.push_str("\n**Contributors**  \n");
        mdx_html.push_str(&contributors);
        mdx_html.push_str("\n");
    }

    mdx_html
}

fn generate_notes_heading(markdown: &String) -> String {
    let mut mdx_notes_heading = String::new();

    let footnote_regex = Regex::new(r"\[\^1\]").unwrap();

    'outer: for line in markdown.lines() {
        for _captures in footnote_regex.captures_iter(line) {
            mdx_notes_heading.push_str("\n**Notes**");
            break 'outer;
        }
    }
    mdx_notes_heading
}
