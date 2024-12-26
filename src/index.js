/* Autor:Víctor Martínez */
const HtmlElement = require("./HtmlElement")

const elements = []
let blockTypes = ["body", "ul", "li", "ol", "form", "header", "section", "article", "aside", "p"]
let inlineBlock = ["h1","h2", "h3", "h4", "span", "hr", "input"]

let id = 0

const findElementoReciente = () => elements.find(elemento => !elemento.selected)

const transformInPug = html => {
    elements.push(new HtmlElement({
        id,
        parent:0,
        innerHtml: `<body>${html}</body>`,
        type: "body",
        profundidad: 0
    }))

    let actual = findElementoReciente()
    while (actual) {
        actual.selected = true
        const nuevo = actual.newInstance()
        nuevo.removeParent()
        if (isHtml({ html: nuevo.innerHtml })) {
            const tags = findMatches({ html: nuevo.innerHtml })
            tags.forEach( tag => {
                for (const innerHtml of tag.matches){
                    id++
                    const profundidad = nuevo.profundidad + 1
                    const idx = elements.findIndex(e => e.id === nuevo.id)
                    const htmlElement = new HtmlElement({
                        id,
                        parent: nuevo.id,
                        type: tag.type,
                        profundidad,
                        innerHtml
                    })

                    if (idx === 0) {
                        elements.push(htmlElement)
                    } else {
                        elements.splice(idx+1, 0, htmlElement)
                    }
                }
            })
        }
        actual = findElementoReciente()
    }

    return outputPug()
}

const outputPug = () => {
    let output = "html\n"
    output += "head\n"
    output += "body\n"
    for(const elemento of elements) {
        output += tabString({profundidad:elemento.profundidad})+toLinea({elemento}) +"\n"
    }
    return output
}

const tabString = ({profundidad}) => {
    const tabArray = []
    for (let i =0; i<profundidad; i++) {
        tabArray.push("\t")
    }
    return tabArray.join("")
}

const isHtml = ({ html }) => {
    for (const type of blockTypes) {
        const regExp = new RegExp(`<${type}.*?>`, "g")
        const tagsHtml = html.match(regExp)
        if (tagsHtml) return true
    }
    return false
}

const findMatches = ({ html }) => {
    const matches = []
    for (const type of blockTypes) {
        const tag = findMatch({type, html})
        if (tag) {
            const regExp = new RegExp(`<${type}.*?>.*?</${type}>`, "g")
            html = html.replace(regExp, "")
            matches.push(tag)
        }
    }
    return matches
}

const findMatch = ({type, html}) => {
    const regExp = new RegExp(`<${type}.*?>.*?</${type}>`, "g")
    const matches = html.match(regExp)
    if (matches) return { type, matches }
    return null
}

const toLinea = ({elemento}) => {
    const regExp = new RegExp(`<${elemento.type} class=.*?>`, "g")
    const busqueda = elemento.innerHtml.match(regExp)
    if (!busqueda) return ""
    let clase = busqueda.at(0).replace(`<${elemento.type} class="`, "")
    clase = clase.replace('">', "")
    return `${elemento.type}.${clase} ${elemento.getText()}`
}

const html = `
<ul class="lenguaje"><li class="lenguaje__item">Javascript</li><li class="lenguaje_item">Html y Css3</li><li class="lenguaje_item">Python</li></ul>
<ul class="framework"><li class="framework__item">ReactJs</li><li class="framework_item">Angular</li><li class="framework_item">Nextjs</li></ul>
<ul class="laptop"><li class="laptop__item">Hp</li><li class="laptop_item">Dell inspirion</li></ul>
<p class="parrafo">pug genera html limpio</p>
<p class="parrafo">Creado por Víctor</p>
`

const pug = transformInPug(html)
console.log(pug)