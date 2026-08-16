# Limbus Colorschemes

This is a colorsscheme set and generator for Vim, inpsired by Limbus Company!

## The Colors

The colors are mostly taken from the Sinners' text colors.
Some other colors can be found in Identity information, for example, the `[On Use]` label.

I tried to use the colors in a way that made sense / told an interesting story.
You can see that story by reading the comments in the `limbus.colortemplate` file!

## Quick Start

If you just want the color schemes:

- Download `colors.zip` from the releases on this repository
- Ensure you actually install `vim` (or equivalent)
- Find or Make the `colors/` directory:
  - On Linux, its `$HOME/.vim/colors`
  - On Windows (I think), its `$HOME/vimfiles/colors`
- Unzip `colors.zip` into the `vim` colors directory.
- In vim, change your colorscheme with: `:colorscheme <name>` where name is e.g. `limbus`
  - You should be able to tab-complete this
- To make these changes permanent, modify your `.vimrc`
  - Location
    - Linux: `$HOME/.vimrc`
    - Windows (I think): `$HOME/vimfiles/.vimrc`
  - What to put in the file: the command above (`:colorscheme <name>`)

## Advanced Usage and Technical Notes

I used a javascript file to generate colors based off the original color set.
This was javascript rather than the much simpler Python because there were no adequate tools that I found for the colorspace I was interested in manipulating ([oklab](https://bottosson.github.io/posts/colorpicker/)).

I was interested in having manipulatable color saturation and perceived lightness, which is what this space excels at!

The instructions from here on will be less specific, as this is the advanced usage section:

### Setting up the build environment

- Install `node.js`
- `git clone` [vim-devel](https://bottosson.github.io/posts/colorpicker/) into your `packs` directory (e.g. `$HOME/.vim/packs`)
  - Or just follow the instructions within this other repository's README
- `git clone` this repository
- `cd` into this repository and run `npm ci` to install the node modules

### Making custom templates

You can see all options for the `build_install.sh` script by running `build_install.sh --help`

Inspiration: `build_all.sh` (This was originally going to be a GitHub Workflow, but I encountered some strange issues...)

Say you want to build and install a new colorpalette with the following properties:
- name is "mycustomlimbus"
- saturation is around 85%
- dark (even) colors are pretty bright (55%)
- light (odd) colors are slightly brighter (65%)

`./build_install.sh -s 0.85 -n mycustomlimbus -e 0.55 -o 0.65`

This should automatically make a colorpalette in your `colors/` directory.
If it does not end up there, you can export a `VIMDATA` variable to point at your `.vim` folder (or equivalent)

Best of Luck, Manager Esquire!
