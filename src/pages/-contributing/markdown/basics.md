---
searchable: false
---

# Basics of Markdown

## Welcome to Markdown

Markdown is a lightweight markup language designed for easy formatting of plain text. It's a simple way to style and structure our writing without the complexity of traditional formatting tools. With Markdown, we can quickly create headers, lists, bold or italic text, links, and more using easy-to-remember symbols.

Markdown is fantastic for web content because of its simplicity and versatility. Its straightforward syntax allows us to quickly create well-formatted content that can easily be converted to HTML, the language of the web. Markdown files are also lightweight, making them perfect for writing content that needs to load quickly on websites, ultimately enhancing user experience. Lastly, and perhaps most pertinent for us, is that markdown allows us to focus on writing content rather than thinking about formatting. Formatting material on the web is its own specialized field and with markdown we retain the formatting necessary for the intelligibility of the content, leaving aesthetics, spacing, fonts, font size, font weight, text responsiveness to the thousands of different screen sizes viewing this page and a legion of other such matters to another domain.

With that said, let's get to it!

## Markdown Basics

### Paragraphs

Almost everything in markdown is separated by an empty line (or two carriage returns, or two keystrokes of "enter"). When you write a line in markdown, it's considered a paragraph. Similar to a rich text editor (like MS Word), you keep on writing and the program makes sure your words don't fall of the edge of the page. Here is an example:

```md
When you write a line in markdown, it's considered a paragraph. Similar to a rich text editor (like MS Word), you keep on writing and the program makes sure your words don't fall of the edge of the page.
```

Notice how the line actually keeps extending (such that you have to scroll to see it). When we write - in virtually *any* program - there is the option to "wrap" the text, such that the program automatically pushes any words on the margin down a line. When we are really done with our line, or pargraph, we hit enter on our keyboard and find ourselves on the next paragraph. 

In markdown, however, we must hit enter twice to make an empty line between the first paragraph and the next, like so:

```md
Notice how the line actually keeps extending (such that you have to scroll to see it). ...

In markdown, however, we must hit enter twice to make an empty line between the first paragraph and the next.
```

There are exceptions to this rule, like when we are making lists or bullet points, and other things. 

### Headings

Six different headings are available in markdown. You make a heading by starting a line with `#`. Add successive `#` if you want to make smaller headings.

```md
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

>💡 On our website, the H1 is used for the page title and won't appear on the page navigation menu on the right. It's best to use H2-H6 for any sections within an article and reserve H1 only for the title.

### Emphasis

You can emphasize (italicize) text with *asterisks* or _underscores_.

Add strong emphasis (bold) with **double asterisks** or __double underscores__.

Combined emphasis with **asterisks _and underscores_**.

Create ~~strikethrough~~ with two tildes.

```md
You can emphasize (italicize) text with *asterisks* or _underscores_.

Add strong emphasis (bold) with **double asterisks** or __double underscores__.

Combined emphasis with **asterisks _and underscores_**!

Create ~~strikethrough~~ with two tildes.
```

