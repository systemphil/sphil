use biblatex::{Chunk, Entry, EntryType, Spanned};
use regex::Regex;
use std::fs;
use std::io::{self, Write};
use utils::BiblatexUtils;
use validator::{ArticleFileData, Metadata};

use crate::{utils, validator};

struct InserterOutcome {
    total_articles_processed: i32,
    total_bibliographies_inserted: i32,
    total_authors_inserted: i32,
    total_notes_headings_inserted: i32,
    total_empty_payloads: i32,
}

pub fn process_mdx_files(all_articles: Vec<ArticleFileData>) {
    let mut inserter_outcome = InserterOutcome {
        total_articles_processed: 0,
        total_bibliographies_inserted: 0,
        total_authors_inserted: 0,
        total_notes_headings_inserted: 0,
        total_empty_payloads: 0,
    };

    for article in all_articles {
        process_mdx_file(article, &mut inserter_outcome);
    }
    println!(
        "===Processing OK. Total articles processed: {}, including {} bibliographies, {} authors, and {} notes headings. {} were empty payloads",
        inserter_outcome.total_articles_processed,
        inserter_outcome.total_bibliographies_inserted,
        inserter_outcome.total_authors_inserted,
        inserter_outcome.total_notes_headings_inserted,
        inserter_outcome.total_empty_payloads
    );
}

fn process_mdx_file(article_file_data: ArticleFileData, inserter_outcome: &mut InserterOutcome) {
    let mut mdx_payload = String::new();
    let mdx_bibliography = generate_mdx_bibliography(article_file_data.matched_citations);

    let mdx_authors = generate_mdx_authors(&article_file_data.metadata);
    let mdx_notes_heading = generate_notes_heading(&article_file_data.markdown_content);

    if !mdx_bibliography.is_empty() {
        mdx_payload.push_str(&mdx_bibliography);
        inserter_outcome.total_bibliographies_inserted += 1;
    }
    if !mdx_authors.is_empty() {
        mdx_payload.push_str(&mdx_authors);
        inserter_outcome.total_authors_inserted += 1;
    }
    if !mdx_notes_heading.is_empty() {
        mdx_payload.push_str(&mdx_notes_heading);
        inserter_outcome.total_notes_headings_inserted += 1;
    }
    if mdx_payload.is_empty() {
        inserter_outcome.total_empty_payloads += 1;
        return;
    }

    let updated_markdown_content =
        format!("{}\n{}", article_file_data.full_file_content, mdx_payload);

    match write_html_to_mdx_file(&article_file_data.path, &updated_markdown_content) {
        Ok(_) => {
            inserter_outcome.total_articles_processed += 1;
            println!(
                "Success! HTML bibliography inserted for {}",
                article_file_data.path
            );
        }
        Err(err) => {
            eprintln!("Error writing HTML to MDX file: {}", err);
            std::process::exit(1);
        }
    }
}

fn write_html_to_mdx_file(path: &str, content: &str) -> io::Result<()> {
    let file = fs::File::create(path)?;
    let mut writer = io::BufWriter::new(file);
    writer.write_all(content.as_bytes())?;
    Ok(())
}

fn generate_mdx_bibliography(entries: Vec<Entry>) -> String {
    let mut mdx_html = String::new();

    if entries.is_empty() {
        return mdx_html;
    }

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
