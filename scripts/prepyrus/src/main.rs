use biblatex::Bibliography;
use regex::Regex;
use serde::Deserialize;
use std::fs;
use std::io::{self, BufReader, Read};

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.len() < 2 {
        eprintln!(
            "Library missing. Please provide a file path as an argument. Remember to include the .bib extension."
        );
        std::process::exit(1);
    }
    if args.len() < 3 {
        eprintln!(
            "Target markdown missing. Please provide a file path as an argument. Remember to include the .mdx extension."
        );
        std::process::exit(1);
    }
    let src = fs::read_to_string(&args[1]).unwrap();
    if !args[1].ends_with(".bib") {
        eprintln!("Invalid file format. Please provide a file with .bib extension.");
        std::process::exit(1);
    }
    if !args[2].ends_with(".mdx") {
        eprintln!("Invalid file format. Please provide a file with .mdx extension.");
        std::process::exit(1);
    }

    let bibliography = Bibliography::parse(&src).unwrap();
    let all_entries = bibliography.into_vec();
    for entry in all_entries {
        println!("{:?}", entry.author().unwrap());
    }

    let (metadata, markdown_content) = match read_mdx_file(&args[2]) {
        Ok(data) => data,
        Err(err) => {
            eprintln!("Error reading MDX file: {}", err);
            std::process::exit(1);
        }
    };

    println!("Is article: {}", metadata.is_article);

    if !metadata.is_article {
        eprintln!("Invalid file format. Please provide a file with isArticle set to true.");
        std::process::exit(1);
    }

    let citations = extract_citations_from_markdown(&markdown_content);
    println!("{:?}", citations);
    println!("No of citations: {:?}", citations.len());
    // let entry = bibliography.get("hegel2010logic").unwrap();
    // let author = entry.author().unwrap();
    // println!("{}", author[0].name);
    // assert_eq!(author[0].name, "Tolkien");
}

#[derive(Debug, Deserialize)]
struct Metadata {
    title: String,
    description: String,
    #[serde(rename = "isArticle")]
    is_article: bool,
}

fn read_mdx_file(path: &str) -> io::Result<(Metadata, String)> {
    let file = fs::File::open(path)?;
    let mut reader = BufReader::new(file);
    let mut content = String::new();
    reader.read_to_string(&mut content)?;

    // Assuming the metadata is enclosed in `---` at the start of the file
    let parts: Vec<&str> = content.splitn(3, "---").collect();
    if parts.len() != 3 {
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            "Invalid MDX file format",
        ));
    }

    let metadata_str = parts[1];
    let metadata: Metadata = match serde_yaml::from_str(metadata_str) {
        Ok(data) => data,
        Err(err) => return Err(io::Error::new(io::ErrorKind::InvalidData, err)),
    };
    let markdown_content = parts[2].to_string();

    Ok((metadata, markdown_content))
}

fn extract_citations_from_markdown(markdown: &String) -> Vec<String> {
    //      Regex explanation
    //
    //      \(      Match an opening parenthesis
    //      ([A-Z]  Match a capital letter
    //      [^()]*? Match any character except opening and closing parenthesis
    //      \d+     Match one or more digits
    //      (?:     Start a non-capturing group
    //      ,       Match a comma
    //      [^)]*   Match any character except closing parenthesis
    //      )?      End the non-capturing group and make it optional
    //      \)      Match a closing parenthesis
    //
    // The regex will match citations in the format (Author 2021) or (Author 2021, 123)
    //
    let citation_regex = Regex::new(r"\(([A-Z][^()]*?\d+(?:,[^)]*)?)\)").unwrap();
    let mut citations = Vec::new();

    for line in markdown.lines() {
        for captures in citation_regex.captures_iter(line) {
            let citation = captures.get(1).unwrap().as_str().trim();
            citations.push(citation.to_string());
        }
    }
    citations
}
