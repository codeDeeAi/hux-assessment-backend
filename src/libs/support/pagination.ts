import { Request } from "express";
import { Model, Document, FilterQuery, PipelineStage } from 'mongoose';

interface QueryResponse {
    data: Model<any>[];
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
    from: number;
    to: number;
}

interface PaginationExtras {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
    from: number;
    to: number;
}

/**
 * Pagination Class for paginating models/queries
 * @author Adeola Bada
 */
class Pagination<T extends Document> {

    private req: Request;
    private model: Model<any>;
    private page: number;
    private per_page: number;
    private totalCount: number;
    private totalPages: number;
    private skip: number;

    constructor(req: Request, model: Model<any>) {
        this.req = req;

        this.model = model;

        if (!this.req) throw new Error("Error with pagination request");

        if (!this.model) throw new Error("Error with pagination model");

        this.page = (this.req.query.page) ? parseInt(String(this.req?.query?.page)) : 1;

        this.per_page = (this.req.query.per_page) ? parseInt(String(this.req?.query?.per_page)) : 25;

        this.skip = (this.page - 1) * this.per_page;

        this.totalCount = 0;

        this.totalPages = 1;
    }


    /**
     * Run a query with pagination
     * @param {FilterQuery<T>} query - The query conditions.
     * @param {Object} options - Pagination options (e.g., limit, skip).
     * @param {Array<string>} columns - (Select all columns by default)
     * @return {Promise<T[]>} - A promise that resolves to an array of documents.
     */
    async query(query: FilterQuery<T>, options: Record<string, any> = {}, columns: Array<string> = []): Promise<QueryResponse | string> {
        try {
            const defaultOptions = { limit: this.per_page, skip: this.skip };

            this.totalCount = await this.model.countDocuments(query);

            const baseQuery = this.model.find(query, null, { ...options, ...defaultOptions });

            if (columns.length > 0) {
                baseQuery.select(columns.join(" "));
            }

            const documents = await baseQuery;

            return {
                data: documents,
                ...this.paginationExtras()
            }
        } catch (error: any) {
            throw new Error(`Error in pagination class: ${error?.message}`);
        }
    }

    /**
     * Run a aggregator with pagination
     * @param {FilterQuery<T>} matchQuery 
     * @param {PipelineStage[]} aggregatePipeline 
     * @returns 
     */
    async aggregate(
        matchQuery: FilterQuery<T>,
        aggregatePipeline: PipelineStage[]
    ): Promise<QueryResponse | string> {
        try {

            const aggregationPipeline = [
                { $match: matchQuery },
                ...aggregatePipeline,
                { $skip: this.skip },
                { $limit: this.per_page }
            ];

            const documents = await this.model.aggregate(aggregationPipeline);

            this.totalCount = await this.model.countDocuments(matchQuery);

            return {
                data: documents,
                ...this.paginationExtras()
            };
        } catch (error: any) {
            throw new Error(`Error in pagination class: ${error?.message}`);
        }
    }

    /**
     * Run a aggregator with pagination
     * This allows more control with mongoose aggregator
     * @param {PipelineStage[]} aggregatePipeline 
     * @param {FilterQuery<T>} matchQuery - for counting documents (defaults to {}) 
     * @returns 
     */
    async aggregateRaw(
        aggregatePipeline: PipelineStage[],
        matchQuery: FilterQuery<T> = {}
    ): Promise<QueryResponse | string> {
        try {

            const aggregationPipeline = [
                ...aggregatePipeline,
                { $skip: this.skip },
                { $limit: this.per_page }
            ];

            const documents = await this.model.aggregate(aggregationPipeline);

            this.totalCount = await this.model.countDocuments(matchQuery);

            return {
                data: documents,
                ...this.paginationExtras()
            };
        } catch (error: any) {
            throw new Error(`Error in pagination class: ${error?.message}`);
        }
    }

    /**
     * Return Extra data needed for pagination
     * @returns {PaginationExtras}
     */
    private paginationExtras(): PaginationExtras {
        return {
            currentPage: this.page,
            perPage: this.per_page,
            totalPages: Math.ceil(this.totalCount / (this.per_page)),
            totalItems: this.totalCount,
            from: this.skip + 1,
            to: (this.skip + this.per_page)
        }
    }

}

// Export Pagination Class
export default Pagination;
