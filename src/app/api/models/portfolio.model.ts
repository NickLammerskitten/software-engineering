export interface PortfolioData {
    name: string;
    description: string | null;
}

export interface PortfolioResponseData extends PortfolioData {
    id: string;
    owner_id: string;
}

export interface PortfolioPutData {
    id: string;
    name: string;
    description: string | null;
}

export interface PortfolioDatabaseData {
    name: string;
    description: string | null;
    owner_id: string;
}

export interface PortfolioDatabaseResponseData extends PortfolioDatabaseData {
    id: string;
}