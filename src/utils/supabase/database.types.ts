export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
    public: {
        Tables: {
            images: {
                Row: {
                    id: string;
                    category_id: number;
                    title: string;
                    price: number;
                    data: Json | null;
                },
                Insert: {
                    id: string;
                    categoryId: number;
                    title: string;
                    price: number;
                    data: Json | null;
                },
                Update: {
                    id: string;
                    categoryId: number;
                    title: string;
                    price: number;
                    data: Json | null;
                },
            }
        }
    }
}