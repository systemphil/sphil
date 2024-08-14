use utils::{BiblatexUtils, CoreUtils};

mod inserter;
mod utils;
mod validator;

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
    CoreUtils::verify_arguments(&args);

    let all_entries = BiblatexUtils::retrieve_bibliography_entries(&args[1]).unwrap();
    let mdx_paths = CoreUtils::extract_paths(&args[2]).unwrap();

    // Phase 1: Verify MDX files
    let articles_file_data = validator::verify_mdx_files(mdx_paths.clone(), &all_entries).unwrap();

    // Phase 2: Process MDX files (requires arg[3] mode to be set to "process")
    if args[3].eq("process") {
        inserter::process_mdx_files(articles_file_data);
    }

    println!("===Prepyrus completed successfully!");
}
