import { toString } from 'mdast-util-to-string'

import { countReadableUnits } from '../src/utils/blog-stats'

import type { Root } from 'mdast'
import type { VFile } from 'vfile'

interface ReadingTimeFrontmatter {
  minutesRead?: number | boolean
  wordCount?: number
}

type AstroReadingTimeFile = VFile & {
  data: VFile['data'] & {
    astro: {
      frontmatter: ReadingTimeFrontmatter
    }
  }
}

/**
 * Used to add a reading time property to the frontmatter of your Markdown or MDX files.
 *
 * @see https://docs.astro.build/en/recipes/reading-time/
 */
const WORDS_PER_MINUTE = 200

function estimateReadingMinutes(text: string) {
  return Math.max(1, Math.round(countReadableUnits(text) / WORDS_PER_MINUTE))
}

function remarkReadingTime() {
  return (tree: Root, file: VFile) => {
    const astroFile = file as AstroReadingTimeFile
    const { frontmatter } = astroFile.data.astro
    const textOnPage = toString(tree)

    frontmatter.wordCount = countReadableUnits(textOnPage)
    if (frontmatter.minutesRead || frontmatter.minutesRead === 0) return

    frontmatter.minutesRead = estimateReadingMinutes(textOnPage)
  }
}

export default remarkReadingTime
