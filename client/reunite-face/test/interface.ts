declare type Gender = 'male' | 'female' | 'other'
declare type Status = 'pending' | 'found' | 'disable' | 'finding'
export interface Account{
  _id: string;
  name:string;
  role:string;
  status:string;
  created_at:string;
  updated_at:string;
}

export interface PostAdmin{
  status: any
  author_name:string
  post_id: string;
  name: string;
  account:Account;
  description: string;
  missing_since: string;
  gender: string;
  dob: string;
  relationship: string;
  address: string;
  contact_info: string;
  create_at: string;
  update_at: string;
  images: Images[]
}
export interface Images{
  _id: string;
  created_at: string;
  is_avatar: boolean;
  s3_key: string;
  url: string;
}





