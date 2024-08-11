use biblatex::{Chunk, Date, DateValue, PermissiveType, Spanned};
use std::io;

pub struct BiblatexUtils;

impl BiblatexUtils {
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
