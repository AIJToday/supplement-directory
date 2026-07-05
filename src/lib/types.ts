// Types for the supplement directory database
export interface Influencer {
  id: string;
  full_name: string;
  channel_name: string;
  channel_url: string;
  subscriber_count: string | null;
  subs_checked_date: string | null;
  bio: string | null;
  profile_image_url: string | null;
  category_tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Supplement {
  id: number;
  product_name: string;
  brand: string;
  category: string;
  form: string | null;
  created_at: string;
}

export interface InfluencerSupplement {
  id: number;
  influencer_id: string;
  supplement_id: number;
  time_of_day: string | null;
  dosage: string | null;
  frequency: string | null;
  timing: string | null;
  comparable_alternative: string | null;
  source_video_title: string | null;
  source_video_url: string;
  source_timestamp: string | null;
  source_date: string | null;
  transcript_excerpt: string | null;
  is_sponsored: boolean;
  is_own_brand: boolean;
  has_affiliate_link: boolean;
  affiliate_details: string | null;
  confidence: "high" | "medium" | "low";
  notes: string | null;
  created_at: string;
}

// Joined types for display
export interface InfluencerWithStack extends Influencer {
  supplements: (InfluencerSupplement & { supplement: Supplement })[];
  stack_count: number;
  high_confidence_count: number;
}

export interface SupplementWithUsers extends Supplement {
  users: (InfluencerSupplement & { influencer: Pick<Influencer, "id" | "full_name" | "channel_name" | "profile_image_url"> })[];
  user_count: number;
}