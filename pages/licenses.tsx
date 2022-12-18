import fs from 'node:fs'
import path from 'node:path'

import type { GetStaticProps, NextPage } from 'next'
import ReactMarkdown from 'react-markdown'

import styles from 'styles/licenses.module.css'
import { Head } from 'components/Head'
import { Link } from 'components/design/Link/Link'

interface Software {
  name: string
  url: string
}

interface LicensesProps {
  LICENSE: string
  softwaresIncluded: Software[]
}

const Licenses: NextPage<LicensesProps> = (props) => {
  const { LICENSE, softwaresIncluded } = props

  return (
    <>
      <Head />
      <main className={styles.mainLicenses}>
        <h1>Licenses</h1>
        <Link href='/'>Revenir au jeu</Link>
        <section className={styles.licenses}>
          <section>
            <ReactMarkdown>{LICENSE}</ReactMarkdown>
          </section>
          <hr className={styles.hr} />
          <p>
            Les paquets suivants ont été utilisés pour développer le jeu :{' '}
            {softwaresIncluded.map((software, index) => {
              const isLast = index === softwaresIncluded.length - 1
              return (
                <span key={index}>
                  <a
                    href={software.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {software.name}
                  </a>
                  {!isLast ? ', ' : '.'}
                </span>
              )
            })}
          </p>
          <p>
            Bibliothèque d&apos;icônes utilisée pour certains visuels :{' '}
            <a
              href='https://remixicon.com/'
              target='_blank'
              rel='noopener noreferrer'
            >
              Remix Icon
            </a>
            .
          </p>
        </section>
      </main>

      <style jsx global>
        {`
          body {
            overflow: auto !important;
          }
        `}
      </style>
    </>
  )
}

export const getStaticProps: GetStaticProps<LicensesProps> = async () => {
  const LICENSE = await fs.promises.readFile(
    path.join(process.cwd(), 'LICENSE'),
    {
      encoding: 'utf-8'
    }
  )
  const { readPackage } = await import('read-pkg')
  const { dependencies, devDependencies } = await readPackage()
  const getSoftwaresFromDependencies = async (
    dependencies?: Record<string, string>
  ): Promise<Software[]> => {
    const softwares: Software[] = []
    if (dependencies != null) {
      for (const [name] of Object.entries(dependencies)) {
        softwares.push({
          name,
          url: `https://www.npmjs.com/package/${name}`
        })
      }
    }
    return softwares
  }
  const softwaresIncluded: Software[] = [
    ...(await getSoftwaresFromDependencies(dependencies)),
    ...(await getSoftwaresFromDependencies(devDependencies))
  ]
  return { props: { LICENSE, softwaresIncluded } }
}

export default Licenses
