export type FigureMode = 'side' | 'below' | 'rows'

export type FigureOptions = {
  image: 'left' | 'center' | 'right'
  preset?: 'wide' | 'half'
  width?: number
  blocks?: number[]
}

export function parseFigureOptions(source: string, mode: FigureMode, blockCount: number): FigureOptions {
  const tokens = source.trim().split(/\s+/)
  const requestedWidth = Number(source.match(/(?:^|\s)width=(\d+(?:\.\d+)?)%(?=\s|$)/)?.[1])
  const width = requestedWidth > 0 && (mode === 'side' ? requestedWidth < 100 : requestedWidth <= 100)
    ? requestedWidth : undefined
  const values = source.match(/(?:^|\s)blocks=(\d+(?:\.\d+)?%?(?:\s*,\s*\d+(?:\.\d+)?%?)*)(?=\s|$)/)?.[1].split(/\s*,\s*/)
  const blocks = values?.every(value => /^\d+(?:\.\d+)?%?$/.test(value))
    ? values.map(value => Number(value.replace('%', ''))) : undefined
  const validBlocks = mode !== 'below' && blocks?.length === blockCount
    && blocks.every(value => value > 0)
    && Math.abs(blocks.reduce((total, value) => total + value, 0) - 100) < .01

  return {
    image: tokens.includes('image=right') ? 'right' : mode === 'rows' && tokens.includes('image=center') ? 'center' : 'left',
    preset: tokens.includes('wide') ? 'wide' : tokens.includes('half') ? 'half' : undefined,
    width,
    blocks: validBlocks ? blocks : undefined,
  }
}
