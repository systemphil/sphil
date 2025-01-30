## Introduction

Here you can find more Markdown formats. There may be more out there but the
following are supported on our website.

## Extended Markdown

### Tables

Here is the syntax to make a table.

```md
| Intuition | Concept                            |
| --------- | ---------------------------------- |
| Time      | Pure Concepts of the Understanding |
| Space     | Ideas of Reason                    |
```

| Intuition | Concept                            |
| --------- | ---------------------------------- |
| Time      | Pure Concepts of the Understanding |
| Space     | Ideas of Reason                    |

### Footnote

Here's a sentence with a footnote.[^1]

```md
Here's a sentence with a footnote.[^1]

[^1]:
    By convention, irrespective of where you write them, all footnotes are
    automatically rendered at the bottom of a page.  
    To add a new line to the footnote, add two spaces to the end of the previous
    line.
```

[^1]:
    By convention, irrespective of where you write them, all footnotes are
    automatically rendered at the bottom of a page.  
    To add a new line to the footnote, add two spaces to the end of the previous
    line.

### Task List

To make a list of tasks, use the following format. Note, these are not
interactive!

```md
- [x] Write the contributing docs
- [ ] Update the website
- [ ] Drink coffee
```

- [x] Write the contributing docs
- [ ] Update the website
- [ ] Drink coffee

### Emoji 😊

Easiest way to add emojis is to copy-paste them from a place like
[Emojipedia](https://emojipedia.org/).

### HTML

Markdown supports HTML tags. You can use these for items otherwise not available
on our site. Like, for example, the following items:

#### Highlight

I need to highlight these <mark>very important words</mark>.

```html
I need to highlight these <mark>very important words</mark>.
```

#### Subscript

H<sub>2</sub>O

```html
H<sub>2</sub>O
```

#### Superscript

X<sup>2</sup>

```html
X<sup>2</sup>
```

#### Inline Styling

To do additional styling, you can do so with injecting CSS into the `style` prop
of an HTML tag.

<span style="color: red; margin-left: 25px; padding: 10px; font-weight: bold; border-radius: 10px; background-color: black;">Here
is a fancy box</span>

```html
<span
    style="color: red; margin-left: 25px; padding: 10px; font-weight: bold; border-radius: 10px; background-color: black;"
    >Here is a fancy box</span
>
```

Normally, it shouldn't be necessary to do any additonal styling, and if we
would, we would do it by other means

### Heading IDs

Headings are automatically processed as IDs and linked to in the navigation bar
to the right. No need for additional tags here. If you hover over a heading, you
will see the section link popup in the `#` to the right of the heading.

### Comments

You can add comments to the file by enclosing the text with `<!-- -->`, which
will not appear in the rendered Markdown. Such as this one:

<!-- Hahah you cannot see me! -->
