import { PortfolioDatabaseResponseData, PortfolioResponseData } from "@/src/app/api/models/portfolio.model";

export const parseGetData = (data: PortfolioDatabaseResponseData): PortfolioResponseData => {
    return {
        id: data.id,
        name: data.name,
        description: data.description,
        owner_id: data.owner_id,
    }
}