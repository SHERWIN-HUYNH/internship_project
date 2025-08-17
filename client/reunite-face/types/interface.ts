export interface MissingPost{
    id_: string,
    name: string,
    description?: string,
    missing_since: string,
    gender: string,
    dob?: string,
    relationship:string,
    address?:string,
    contact_infor:string,
    images: { 
    _id: string;
    created_at: string;
    is_avatar: boolean;
    s3_key: string;
    url: string;
  }[];
}