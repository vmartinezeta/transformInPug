class HtmlElement {
    constructor({
        id,
        parent,
        profundidad,
        type,
        innerHtml
    }) {
        this.id = id
        this.parent = parent
        this.profundidad = profundidad
        this.type = type
        this.innerHtml = innerHtml
        this.selected = false
    }

    isText() {
        const regExp = new RegExp(`<.*?>`, "g")
        const matches = this.innerHtml.match(regExp) || []
        return matches.length === 0
    }

    findMatches() {
    }

    getText() {
        const nuevo = this.newInstance()
        nuevo.removeParent()
        if (nuevo.isText()) return nuevo.innerHtml
        return ""
    }

    removeParent() {
        const regExp = new RegExp(`<${this.type}.*?>`, "g")
        const matches = this.innerHtml.match(regExp)
        if (!matches) return
        const tag = matches.at(0)
        const regExp2 = new RegExp(`${tag}`, "g")
        this.innerHtml = this.innerHtml.replace(regExp2, "")
        const regExp3 = new RegExp(`</${this.type}>`, "g")
        this.innerHtml = this.innerHtml.replace(regExp3, "")
    }

    newInstance() {
        return new HtmlElement({
            id: this.id,
            parent: this.parent,
            profundidad: this.profundidad,
            type: this.type,
            innerHtml: this.innerHtml
        })
    }
}

module.exports= HtmlElement