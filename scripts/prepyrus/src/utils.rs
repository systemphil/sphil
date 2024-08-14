use biblatex::{Bibliography, Chunk, Date, DateValue, Entry, PermissiveType, Spanned};
use std::{fs, io, path::Path};

pub struct BiblatexUtils;
pub struct CoreUtils;

impl BiblatexUtils {
    pub fn retrieve_bibliography_entries(bibliography_path: &str) -> io::Result<Vec<Entry>> {
        let bibliography_path = fs::read_to_string(bibliography_path).unwrap();
        let bibliography = Bibliography::parse(&bibliography_path).unwrap();
        Ok(bibliography.into_vec())
    }

    pub fn extract_year(date: &PermissiveType<Date>, reference: String) -> Result<i32, io::Error> {
        match date {
            PermissiveType::Typed(date) => match date.value {
                DateValue::At(datetime) => Ok(datetime.year),
                DateValue::After(datetime) => Ok(datetime.year),
                DateValue::Before(datetime) => Ok(datetime.year),
                DateValue::Between(start, _end) => Ok(start.year), // Or use end.year
            },
            _ => Err(io::Error::new(
                io::ErrorKind::InvalidData,
                format!("Unable to retrieve year for: {}", reference),
            )),
        }
    }

    /// Use this to extract from a Spanned<Chunk> vector
    /// ```
    /// let address = extract_spanned_chunk(&address_spanned);
    /// ```
    pub fn extract_spanned_chunk(spanned_chunk: &[Spanned<Chunk>]) -> String {
        spanned_chunk
            .iter()
            .filter_map(|spanned_chunk| match spanned_chunk.v {
                Chunk::Normal(ref s) => Some(s.clone()),
                _ => None,
            })
            .collect()
    }

    pub fn extract_publisher(publisher_data: &Vec<Vec<Spanned<Chunk>>>) -> String {
        publisher_data
            .iter()
            .flat_map(|inner_vec| {
                inner_vec
                    .iter()
                    .filter_map(|spanned_chunk| match spanned_chunk.v {
                        Chunk::Normal(ref s) => Some(s.clone()),
                        _ => None,
                    })
            })
            .collect()
    }
}

impl CoreUtils {
    pub fn extract_paths(path: &str) -> io::Result<Vec<String>> {
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

        let mdx_paths_raw = Self::extract_mdx_paths(path).unwrap();
        let mdx_paths = Self::filter_mdx_paths_for_exceptions(mdx_paths_raw, exceptions);

        Ok(mdx_paths)
    }

    pub fn verify_arguments(args: &Vec<String>) {
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
                let sub_paths = Self::extract_mdx_paths(path.to_str().unwrap())?;
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

    fn filter_mdx_paths_for_exceptions(
        mdx_paths: Vec<String>,
        exceptions: Vec<String>,
    ) -> Vec<String> {
        let mut filtered_paths = Vec::new();
        for path in mdx_paths {
            if !exceptions.contains(&path) {
                filtered_paths.push(path);
            }
        }
        filtered_paths
    }
}
