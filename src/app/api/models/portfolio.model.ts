export interface PortfolioData {
    name: string;
    description: string | null;
}

export interface PortfolioResponseData extends PortfolioData {
    id: string;
    owner_id: string;
}

export interface PortfolioDatabaseData {
    name: string;
    description: string | null;
    owner_id: string;
}

export interface PortfolioDatabaseResponseData extends PortfolioDatabaseData {
    id: string;
}