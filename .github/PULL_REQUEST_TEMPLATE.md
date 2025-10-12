<!-- Thank you for wanting to contribute to sPhil! 🧙 🦉 -->
<!-- We would like to keep our code and writing as neat and tidy as possible, and would appreciate if you could verify the following checklist if you are submitting philosophical or literary content -->

## Guidelines and Checklists (click to expand)

<details>
<summary>📝 Guidelines for Philosophical/Literary Contributions</summary>

### License Agreement

By submitting this PR, you agree to license your content under the
[CC BY-NC-SA 4.0 License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

### Required Steps

1. Please follow the [formatting guidelines](https://github.com/systemphil/sphil/blob/main/content/contributing/formatting/basic-markdown.md).
2. For citations, kindly use [Chicago author-date style](https://www.chicagomanualofstyle.org/tools_citationguide/citation-guide-2.html).
3. If needed, make sure to update the [project's central bibliography](https://github.com/systemphil/sphil/blob/main/README_BIBLIOGRAPHY.md).
4. Add metadata at the top of your file, with title in `##` heading for the title, like so:

```md
---
title: Abbreviated title
indexTitle: Title for the index (include the philosopher or system in parentheses)
seoTitle: Full title used for external links (This is the actual title)
description: Brief description of your content
isArticle: true
authors: Your Name (Year)
editors: Editor Name (Year)
contributors: Contributor Name (Year)
keywords: [word1, word2, word3]
---

## Your Article Title

```

### Optional

Consider adding the Stub component to encourage further contributions, like so:

```tsx
import { Stub } from "lib/components/ui/Stub";

<Stub />
``` 

</details>

<details>
<summary>💻 Guidelines for Code Contributions</summary>

### Recommended Steps

1. Ensure your PR is [linked to an issue](https://github.com/systemphil/sphil/issues), or create one if missing. This is to ensure that multiple contributors are not working over each other on the same thing.
2. Review [contributions document for coding](https://github.com/systemphil/sphil/blob/main/CONTRIBUTING.md).

### License Scope

The Apache License 2.0 applies to all code except content within `content/**` folder (excluding `/contributing/**`, `_meta.ts`, `acknowledgements.mdx`, `index.mdx`, `privacy.mdx`, `team.mdx`, `terms.mdx`). This primarily covers technical implementations rather than content, literature, or philosophy.

</details>

## License Agreement

By submitting this PR, you agree to license your content under the
[CC BY-NC-SA 4.0 License](https://creativecommons.org/licenses/by-nc-sa/4.0/)
and your code under the
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt).

## Notice

🪄 Formatting is automatically applied by scripts. If you find there has been an error, [create an issue](https://github.com/systemphil/sphil/issues) or contact us [by email](mailto:service@systemphil.com).