use prepyrus::run_prepyrus;

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.len() < 4 {
        eprintln!(
            "Expected more args. Usage: prepyrus <bibliography.bib> <target_dir_or_file> <mode>"
        );
        std::process::exit(1);
    }

    if let Err(e) = run_prepyrus(&args[1], &args[2], &args[3]) {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    }
}
