import { PortfolioDatabaseResponseData, PortfolioResponseData } from "@/src/app/api/models/portfolio.model";

export const parseGetData = (data: PortfolioDatabaseResponseData[]): PortfolioResponseData[] => {
    return data.map((entry) => {
        return {
            id: entry.id,
            name: entry.name,
            description: entry.description,
            owner_id: entry.owner_id,
        }
    });
}