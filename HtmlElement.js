export default class HtmlElement {
    constructor({
        id,
        parent,
        zindex,
        type,
        hasChildren = true,
        innerHtml
    }) {
        this.id = id
        this.parent = parent
        this.zindex = zindex
        this.type = type
        this.hasChildren = hasChildren
        this.innerHtml = innerHtml
    }

    isText() {
        return /\w*/.test(this.innerHtml)
    }

    removeParent() {
        const regExp = new RegExp(`<${this.type}.*?>`, "g")
        const tag = this.innerHtml.match(regExp).at(0)
        const regExp2 = new RegExp(`${tag}`, "g")
        this.innerHtml = this.innerHtml.replace(regExp2, "")
        const regExp3 = new RegExp(`</${this.type}>`, "g")
        this.innerHtml = this.innerHtml.replace(regExp3, "")
    }

    newInstance() {
        return new HtmlElement({
            id: this.id,
            parent: this.parent,
            zindex: this.zindex,
            type: this.type,
            hasChildren: this.hasChildren,
            innerHtml: this.innerHtml
        })
    }
}