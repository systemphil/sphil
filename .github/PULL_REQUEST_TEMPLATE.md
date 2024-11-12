<!-- Thank you for wanting to contribute to sPhil! 🧙 🦉 -->
<!-- We would like to keep our code and writing as neat and tidy as possible, and would appreciate if you could verify the following checklist if you are submitting philosophical or literary content -->

## PR Author's Note

<!-- Write your PR text here -->

## Checklist

-   [ ] Philosophical or literary contribution (docs). Leave **unchecked** for
    <code>code</code> contribution.

    -   **IMPLIED CONSENT** By opening this pull request and contributing
        philosophical or literary content, I accept that my writing is submitted
        under the
        [ATTRIBUTION-NONCOMMERCIAL-SHAREALIKE 4.0 INTERNATIONAL](https://creativecommons.org/licenses/by-nc-sa/4.0/),
        which:

        -   Prohibits commercial reuse of the content.
        -   Allows sharing, remixing, and building upon the material as long as
            attribution is given.

        I understand that my writing may be modified, remixed, and built upon by
        others within the `systemphil/sphil` or sPhil project, in accordance
        with the license terms, indefinitely. See
        [legal code](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.en).

    -   **REQUIRED** I have followed the
        [formatting guidelines](https://github.com/systemphil/sphil/blob/dev/src/pages/contributing/formatting/basic-markdown.md)
        and verified there are no formatting bugs.
        [Try markdown preview here](https://markdownlivepreview.com/).
    -   **REQUIRED** I have followed the
        [Chicago author-date style](https://www.chicagomanualofstyle.org/tools_citationguide/citation-guide-2.html).
    -   **REQUIRED** I have added or verified metadata title, description, and
        contributors at the _very top_ of the file followed by a `##` title
        heading. Additionally, I have ensured `isArticle` is set to `true`.
        Example:

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

        <details>

        <summary>Further information</summary>

        I have signed the document with my name/username under either as
        `Authors`, `Editors` or `Contributors`.

        > Use **Authors** if you have created and substantially added content.  
        > Use **Editor** if you have made substantial edits or review.  
        > Use **Contributor** if you have made minor edits, reviews or
        > contributions.  
        > If you've done multiple, pick the most weighted: Author > Editor >
        > Contributor.  
        > If you prefer to remain anonymous, that's fine too, but note that a
        > record of your contributions based on your GitHub username will exist
        > here in the codebase.

        </details>

    -   **REQUIRED** I have ensured that the
        [project's central bibliography](https://github.com/systemphil/sphil/blob/main/README_BIBLIOGRAPHY.md)
        contains the necessary bibliographical details for the citations I have
        used.

    -   _Optional_ My article is a stub or I want to actively encourage
        contribution, I've added the Stub component to the bottom of my content
        or where relevant:

        ```ts
        import Stub from "@/components/Stub";

        <Stub />;
        ```

-   **If Docs contribution is unchecked:** Code contribution
    ([Apache version 2 license](https://www.apache.org/licenses/LICENSE-2.0.txt))
      <details>

    All code apart of what is inside `content/**` (excluding `/contributing/**`,
    `_meta.ts`, `acknowledgements.mdx`, `index.mdx`, `privacy.mdx`, `team.mdx`,
    `terms.mdx`) is subject to Apache version 2 license. Basically, anything
    outside of content, literature, philosophy.

      </details>
