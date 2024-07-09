Thank you for wanting to contribute to sPhil! 🧙 

We would like to keep our code and writing as neat and tidy as possible, and would appreciate if you could verify the following.

Each PR should _either_ contribute content or functional code.

## Checklist 

This is a:
- [ ] Docs contribution (philosophy, literature, content)
    - [ ] I have followed the [formatting guidelines](/src/pages/contributing/formatting/basic-markdown.md).
    - [ ] I have followed the [MLA citation style](https://owl.purdue.edu/owl/research_and_citation/mla_style/mla_formatting_and_style_guide/mla_formatting_and_style_guide.html).
    - [ ] I have added, verified or extended a bibliography. Example:
        ```mdx
        ## Works Cited

        <div className="text-sm">
        - Hegel, Friedrich Georg Wilhelm. _The Science of Logic_. Translated by George di Giovanni, Cambridge University Press, 2010.
        - Kant, Immanuel. _The Critique of Pure Reason_. Edited by Paul Guyer and Allen W. Wood, Cambridge University Press, 1998.
        </div>
        ```
    - [ ] I have added or verified title and description metadata.
        ```md
        ---
        title: Hegel Guides
        description: Learn about the philosophy of G. W. F. Hegel
        ---
        ```
    - [ ] (optional) I have signed the document with my name/username under either as `Author`, `Editor` or `Contributor`. Example:
        ```md
        **Authors**  
        Ahilleas Rokni (2024)

        **Contributors**  
        Filip Niklas (2024)
        ```
    - [ ] (optional) If the article is a stub or you want to actively encourage contribution, please add the following code at the bottom of the article content:
        ```ts
        import Stub from "@/components/Stub";
        <Stub />
        ```


- [ ] Code contribution

-------