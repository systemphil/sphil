# sPhil's Bibliography

We have a system set up where you only need to ensure that bibliographical
details are written just once. This is done in a central `.bib` file.

From there, all inline citations follow Chicago author date format, like so
`(Hegel 2024, 21)` and our pre-build scripts will retrieve and build out the
bibliography automatically.

## How Check If Your Reference Already Exists

Inspect the
[bibliography file](https://github.com/systemphil/sphil/blob/main/absolute_bibliography.bib)
and hit `Ctrl` + `F` to search the text. If your reference is there, then you
are all good to go.

## How to Add A New Entry To The Central Bibliography

If you need to add a new entry, first find a [BibTex](https://www.bibtex.org/)
citation or create one yourself. Examples can be found on Google Books, clicking
the "Create Citation" button and selecting "BibTex".

- Assuming you already have forked the codebase and have submitted a pull
  request to add your changes. For more info, please consult
  [the contributions guide](https://sphil.xyz/articles/contributing).
- Once you have your BibTex citation/reference, verify the details are accurate
  (even Google Books get it wrong). Consult the source book for the correct
  details.
- Paste the BibTex citation into the
  [bibliography file](https://github.com/systemphil/sphil/blob/main/absolute_bibliography.bib)
  in your pull request or working branch, and commit the changes.

That should be everything! It is super simple and effective

## Limitations

At the time of writing our scripting system supports books and articles. Check
in with maintainers if you require something else.
