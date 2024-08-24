export const OrderDirection = Object.freeze({
    ASC: 'asc',
    DESC: 'desc'
});

const QueryType = Object.freeze({
    FILTER: '$filter',
    ORDERBY: '$orderby',
    SELECT: '$select',
    TOP: '$top',
    SKIP: '$skip',
    EXPAND: '$expand',
    COUNT: '$count'
});

export class FilterBuilder {
    constructor() {
        this.filters = [];
    }

    contains(field, value) {
        this.filters.push(`contains(${field}, '${value}')`);
        return this;
    }

    startsWith(field, value) {
        this.filters.push(`startswith(${field}, '${value}')`);
        return this;
    }

    endsWith(field, value) {
        this.filters.push(`endswith(${field}, '${value}')`);
        return this;
    }

    equal(field, value) {
        this.filters.push(`${field} eq ${this._formatValue(value)}`);
        return this;
    }

    notEqual(field, value) {
        this.filters.push(`${field} ne ${this._formatValue(value)}`);
        return this;
    }

    greaterThan(field, value) {
        this.filters.push(`${field} gt ${this._formatValue(value)}`);
        return this;
    }

    lessThan(field, value) {
        this.filters.push(`${field} lt ${this._formatValue(value)}`);
        return this;
    }

    greaterThanOrEqual(field, value) {
        this.filters.push(`${field} ge ${this._formatValue(value)}`);
        return this;
    }

    lessThanOrEqual(field, value) {
        this.filters.push(`${field} le ${this._formatValue(value)}`);
        return this;
    }

    and() {
        this.filters.push('and');
        return this;
    }

    or() {
        this.filters.push('or');
        return this;
    }

    _formatValue(value) {
        return typeof value === 'string' ? `'${value}'` : value;
    }

    build() {
        return this.filters.join(' ');
    }
}


export class ODataQueryBuilder {
    constructor(name) {
        this.name = name;
        this.queryParts = [];
        this.isCountQuery = false;
    }

    filter(condition) {
        this.queryParts.push({ type: QueryType.FILTER, value: condition });
        return this;
    }

    orderBy(field, direction = OrderDirection.ASC) {
        this.queryParts.push({ type: QueryType.ORDERBY, value: `${field} ${direction}` });
        return this;
    }

    select(fields) {
        if (Array.isArray(fields)) {
            fields = fields.join(',');
        }
        this.queryParts.push({ type: QueryType.SELECT, value: fields });
        return this;
    }

    top(n) {
        this.queryParts.push({ type: QueryType.TOP, value: n });
        return this;
    }

    skip(n) {
        this.queryParts.push({ type: QueryType.SKIP, value: n });
        return this;
    }

    expand(entity, expandBuilder = null) {
        if (expandBuilder && expandBuilder instanceof ODataQueryBuilder && expandBuilder.queryParts.length > 0) {
            const expandQuery = expandBuilder.buildQueryOnly();
            this.queryParts.push({ type: QueryType.EXPAND, value: `${entity}(${expandQuery})` });
        } else {
            this.queryParts.push({ type: QueryType.EXPAND, value: entity });
        }
        return this;
    }

    count() {
        this.isCountQuery = true;
        return this;
    }

    buildQueryOnly() {
        return this.queryParts
            .map(part => `${part.type}=${part.value}`)
            .join('&');
    }

    build() {
        if (this.isCountQuery) {
            const filteredParts = this.queryParts.filter(part =>
                part.type === QueryType.FILTER
            );
            const queryString = filteredParts
                .map(part => `${part.type}=${part.value}`)
                .join('&');
            return `${this.name}/$count?${queryString}`;
        } else {
            const queryString = this.queryParts
                .map(part => `${part.type}=${part.value}`)
                .join('&');
            return `${this.name}?${queryString}`;
        }
    }
}