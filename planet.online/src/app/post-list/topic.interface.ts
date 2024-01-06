// The interface is created because Angular was giving a type error in post-list.html
export interface Topic {
  topic_id: string;
  topic_name: string;
  description: string;
}
