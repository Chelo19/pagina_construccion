import {createClient} from '@supabase/supabase.js'

export const client = createClient(
    'https://xadwiefldpzbsdciapia.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZHdpZWZsZHB6YnNkY2lhcGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY5MzIwNzAsImV4cCI6MTk4MjUwODA3MH0.FP6WzUVT2VAcej2w7ai-Hn0uCAxnYhjJSEswYL8SCDQ'
);