// Autor:Víctor Martínez

import HtmlElement from "./HtmlElement.js"

const elements = []
let types = ["ul", "li", "ol", "form", "header", "section", "article", "aside"]
let id = 0

const transformInPug = html => {
    let zindex = 1
    createObject({ html, parent: 0, zindex })
    zindex++
    for (const elem of elements) {
        const nuevo = elem.newInstance()
        nuevo.removeParent()
        if (nuevo.isText()) {
            continue
        }
        createObject({
            html: nuevo.innerHtml,
            parent: nuevo.id,
            zindex
        })
    }

    let output = "html\n"
    output += "head\n"
    output += "body\n"
    output += formatter(elements)

    return output
}

const createObject = ({ html, parent, zindex }) => {
    for (const type of types) {
        const regExp = new RegExp(`<${type}.*?>.*?</${type}>`, "g")
        const tagsHtml = html.match(regExp)
        if (!tagsHtml) continue

        tagsHtml.forEach(innerHtml => {
            id++
            elements.push(new HtmlElement({
                id,
                parent,
                type,
                zindex,
                innerHtml
            }))
        })
    }
}

const formatter = (elements, type = "ul") => {
    let output = ""
    for (const elem of elements) {
        const regExp = new RegExp(`<${type} class=.*?>`, "g")
        const busqueda = elem.innerHtml.match(regExp)
        if (!busqueda) continue
        let clase = busqueda.at(0).replace(`<${type} class="`, "")
        clase = clase.replace('">', "")
        output += `\t${type}.${clase}\n`
    }
    return output
}

const html = `
<ul class="lenguaje"><li class="lenguaje__item">Javascript</li><li class="lenguaje_item">Html y Css3</li></ul>
<ul class="framework"><li class="framework__item">ReactJs</li><li class="framework_item">Angular</li><li class="framework_item">Nextjs</li></ul>
<ul class="laptop"><li class="laptop__item">Hp</li><li class="laptop_item">Dell inspirion</li></ul>
`

const pug = transformInPug(html)
console.log(pug)