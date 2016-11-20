# postcss-molten
Used for shorthand for molten leading calculations in font, line-height, margins and more.

## Installation
1. Run `npm install postcss-molten --save`.
2. Add `require("postcss-molten")()` to your plugins array for PostCSS.

## Recommended Usage
Based on the artical by Michael Riethmuller at [Smashing Magazine](https://www.smashingmagazine.com/2016/05/fluid-typography/).

#### Example 1 - Fluid Typography
```css
html {
  font-size: 12rem;
}

@media screen and (min-width: 30rem) {
  html {
    font-size: molten(12 22 30 55 'rem');
  }
}

@media screen and (min-width: 55rem) {
  html {
    font-size: 22rem;
  }
}
```

## Example of Usage
The plugin currently does not do any calculations of unit types. May add this feature in the future to make it easier to use. Below are example usage patterns both valid and invalid.

### Valid Usage
```css
html {
  /* With Commas */
  font-size: molten(16, 22, 30, 45, 'rem');
  /* Without Commas */
  line-height: molten(1.4 1.8 30 40 'rem');
}

h1 {
  /* Units Inline */
  font-size: molten(22em 36em 30em 45em);
  /* No Units, defaults to REM - Note: throws warning, but not error) */
  margin-bottom: molten(1.5 3.0 20 50);
}

p {
  /* Oddity - Only one unit needs specified as long as there
  are no conflicting units it will be used for all entries. */
  margin-bottom: molten(2rem 4 20 50);
}
```

### Invalid Usage
```css
blockquote {
  /* Invalid! - Do not mix units */
  font-size: (18rem 22rem 320px 720px);
  /* May add conversion in the future, with the goal to
  convert to rem if no unit specified in 5 param spot */
}
```

## Notes

Make sure you include this plugin below `postcss-cssnext` plugin in your plugins array if you want to use `var()`.