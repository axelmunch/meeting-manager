import NextHead from 'next/head'

export interface HeadProps {
  title?: string
  description?: string
}

export const Head: React.FC<HeadProps> = (props) => {
  const {
    title = 'Meeting Manager',
    description = "Comprendre comment la co-construction s'organise, constater les intéractions et les influences entre des acteurs de plusieurs domaines."
  } = props

  return (
    <NextHead>
      <title>{title}</title>
      <meta name='description' content={description} />
      <link rel='icon' href='/favicon.ico' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    </NextHead>
  )
}
