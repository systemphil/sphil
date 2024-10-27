---
searchable: false
---

# Basics of Markdown

## Welcome to Markdown

Markdown is a lightweight markup language designed for easy formatting of plain
text. It's a simple way to style and structure our writing without the
complexity of traditional formatting tools. With Markdown, we can quickly create
headers, lists, bold or italic text, links, and more using easy-to-remember
symbols.

Markdown is fantastic for web content because of its simplicity and versatility.
Its straightforward syntax allows us to quickly create well-formatted content
that can easily be converted to HTML, the language of the web. Markdown files
are also lightweight, making them perfect for writing content that needs to load
quickly on websites, ultimately enhancing user experience. Lastly, and perhaps
most pertinent for us, is that markdown allows us to focus on writing content
rather than thinking about formatting. Formatting material on the web is its own
specialized field and with markdown we retain the formatting necessary for the
intelligibility of the content, leaving aesthetics, spacing, fonts, font size,
font weight, text responsiveness to the thousands of different screen sizes
viewing this page and a legion of other such matters to another domain.

> 👉 The following guide is rather verbose. If you would like something quick
> and straight the point, consider visiting
> [this cheatsheet](https://www.markdownguide.org/cheat-sheet/).

With that said, let's get to it!

## Markdown Basics

### Paragraphs

Almost everything in markdown is separated by an empty line (or two carriage
returns, or two keystrokes of "enter"). When you write a line in markdown, it's
considered a paragraph. Similar to a rich text editor (like MS Word), you keep
on writing and the program makes sure your words don't fall of the edge of the
page. Here is an example:

```md
When you write a line in markdown, it's considered a paragraph. Similar to a
rich text editor (like MS Word), you keep on writing and the program makes sure
your words don't fall of the edge of the page.
```

Notice how the line actually keeps extending (such that you have to scroll to
see it). When we write - in virtually _any_ program - there is the option to
"wrap" the text, such that the program automatically pushes any words on the
margin down a line. When we are really done with our line, or pargraph, we hit
enter on our keyboard and find ourselves on the next paragraph.

In markdown, however, we must hit enter twice to make an empty line between the
first paragraph and the next, like so:

```md
Notice how the line actually keeps extending (such that you have to scroll to
see it). ...

In markdown, however, we must hit enter twice to make an empty line between the
first paragraph and the next.
```

There are exceptions to this rule, like when we are making lists or bullet
points, and other things.

### Headings

Six different headings are available in markdown. You make a heading by starting
a line with `#`. Add successive `#` if you want to make smaller headings.

```md
# H1

## H2

### H3

#### H4

##### H5

###### H6
```

> 💡 On our website, the H1 is used for the page title and won't appear on the
> page navigation menu on the right. It's best to use H2-H6 for any sections
> within an article.

### Emphasis

You can emphasize (italicize) text with _asterisks_ or _underscores_.

Add strong emphasis (bold) with **double asterisks** or **double underscores**.

Combined emphasis with **asterisks _and underscores_**.

Create ~~strikethrough~~ with two tildes.

```md
You can emphasize (italicize) text with _asterisks_ or _underscores_.

Add strong emphasis (bold) with **double asterisks** or **double underscores**.

Combined emphasis with **asterisks _and underscores_**!

Create ~~strikethrough~~ with two tildes.
```

### Blockquote

To make a block quote, start a paragraph with `>`.

> Thoughts without content are empty, intuitions without concepts are blind. The
> understanding can intuit nothing, the senses can think nothing. Only through
> their unison can knowledge arise. - Kant

```md
> Thoughts without content are empty, intuitions without concepts are blind. The
> understanding can intuit nothing, the senses can think nothing. Only through
> their unison can knowledge arise. - Kant
```

### Lists

To make an ordered list, start a line with a number. Here we see an exception to
the rule of making an empty line between lines. Note also that you can repeat
the same number and the program will assign the correct order.

1. Item one.
1. Item two.
1. Item three.

```md
1. Item one.
1. Item two.
1. Item three.
```

To make an unordered list, start a line with with a hyphen `-` or an asterisk
`*`.

-   Kant
-   Hume
-   Rousseau

```md
-   Kant
-   Hume
-   Rousseau
```

#### Nested Lists

To make items nested in a list, you add two spaces before the bullet item.

-   Kant's Table of Judgments
    -   Quantity
        -   Universal
        -   Particular
        -   Singular
    -   Quality
        -   Affirmative
        -   Negative
        -   Infinite
    -   Relation
        -   Categorical
        -   Hypothetical
        -   Disjunctive
    -   Modality
        -   Problematical
        -   Assertoric
        -   Apodictic

```md
-   Kant's Table of Judgments
    -   Quantity
        -   Universal
        -   Particular
        -   Singular
    -   Quality
        -   Affirmative
        -   Negative
        -   Infinite
    -   Relation
        -   Categorical
        -   Hypothetical
        -   Disjunctive
    -   Modality
        -   Problematical
        -   Assertoric
        -   Apodictic
```

### Horizontal Rule

To make a horizontal rule or line across the page, use three hyphens `---`.

---

```md
---
```

### Code

To format text as `code`, enclose it in backticks ` .

`code-formatted-text`

```md
`code-formatted-text`
```

You can also make a fenced code block by enclosing a block of text with a line
of triple backticks before and after the block. For example:

```json
{
    "firstName": "John",
    "lastName": "Smith",
    "age": 25
}
```

````
    ```json
    {
    "firstName": "John",
    "lastName": "Smith",
    "age": 25
    }
    ```
````

If you want to highlight a specific a specific code format, such as Markdown or
JSON, you can add `md` or `json` right after the first three backticks.

### Link

To make a [link](https://ncatlab.org/nlab/show/HomePage), use `[]()` as in
`[name-of-your-link](the-actual-HTTP-address)`.

```md
To make a [link](https://ncatlab.org/nlab/show/HomePage).
```

Alternatively, you can write the HTTP address directly into the text and
Markdown will highlight it as a link.

https://ncatlab.org/nlab/show/HomePage

#### Linking Between Pages and Articles

If you want to link to another page on this website, use relative linking. This
begins with a `/`, which signifies that the address begins from the root of the
website. For example, if you want to link to the article on _mechanical object_
in the Hegel Reference section, you would write:

```md
[Link to Mechanical Object](/hegel/reference/mechanical-object)
```

[Link to Mechanical Object](/hegel/reference/mechanical-object)

### Image

To add an image, you basically make a link but start the code with a bang or
exclamation mark `!`.

![Buddy](/images/contributing/buddy.jpg)

```
![Buddy](/images/contributing/buddy.jpg)
```

> ℹ️ Notice that image source does not start with `http` or `https`, this is
> because this particular image is being loaded from the website itself and so
> it's being sourced relative where the public assets are stored. In the
> codebase, you'll find this under `/public`.

## Conclusion

This covers the basic formatting in Markdown. We encourage you to click
<span style="color: gray;">Edit this page on GibHub</span> in the right
navigation panel to view the Markdown of this page! Alternatively,
[click here](https://github.com/systemphil/sphil/tree/main/src/pages/contributing/formatting/basic-markdown.md).
