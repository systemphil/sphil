<!-- Thank you for wanting to contribute to sPhil! 🧙 🦉 -->
<!-- We would like to keep our code and writing as neat and tidy as possible, and would appreciate if you could verify the following checklist if you are submitting philosophical or literary content -->

## Author's Note
<!-- Briefly describe your changes and their purpose -->

## Contribution Type
- [ ] Philosophical/Literary Content (docs)
- [ ] Code Contribution

## Checklist

### For Philosophical/Literary Contributions
- [ ] I accept the [CC BY-NC-SA 4.0 License](https://creativecommons.org/licenses/by-nc-sa/4.0/) terms for my content.
- [ ] I've followed the [formatting guidelines](https://github.com/systemphil/sphil/blob/dev/src/pages/contributing/formatting/basic-markdown.md).
- [ ] I've used the [Chicago author-date style](https://www.chicagomanualofstyle.org/tools_citationguide/citation-guide-2.html) for citations.
- [ ] I have added or verified metadata title, description, and
        contributors at the _very top_ of the file followed by a `##` title
        heading. Additionally, I have ensured `isArticle` is set to `true`.

        <details>
        <summary>Example</summary>

        ```md
        ---
        title: The Immediate Difference Between Pure Being and Pure Nothing
        description:
            Learn about the difference between being and nothing in Hegel's
            Science of Logic.
        isArticle: true
        authors: Jerry Maguire (2024)
        editors: Steve Stevenson (2023), Karen Hansen (2022)
        contributors:
        ---

        ## My Article Title
        ```

        </details>

        <details>
- [ ] I've ensured the [project's central bibliography](https://github.com/systemphil/sphil/blob/main/README_BIBLIOGRAPHY.md) is up-to-date.

### For Code Contributions
- [ ] My code adheres to the project's coding standards.
- [ ] I've tested my changes thoroughly.
- [ ] I consent to my code being licensed under the Apache License 2.0.
    ([Apache version 2 license](https://www.apache.org/licenses/LICENSE-2.0.txt))
      <details>

    All code apart of what is inside `src/pages/**` (excluding
    `/contributing/**`, `_app.mdx`, `_document.tsx`, `_meta.json`,
    `acknowledgements.mdx`, `index.mdx`, `privacy.mdx`, `team.mdx`, `terms.mdx`)
    is subject to Apache version 2 license. Basically, anything outside of
    content, literature, philosophy.

      </details>

### Optional
- [ ] I've added the Stub component to encourage further contributions.

<details>
<summary>Additional Information</summary>

- For philosophical/literary contributions, your content will be under the CC BY-NC-SA 4.0 license.
- For code contributions, your code will be under the Apache License 2.0.
- Please sign your contribution under Authors, Editors, or Contributors in the metadata.

</details>
