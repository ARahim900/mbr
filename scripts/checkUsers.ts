import { createClient } from '@supabase/supabase-js';

// Remove unused interface
// interface LocalUser {
//   id: string;
//   email: string;
//   created_at: string;
// }

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  try {
    console.log('Checking Supabase connection...');
    
    // Test connection by getting session
    const { error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return;
    }

    console.log('✅ Supabase connection successful');

    // Test database access
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);

    if (usersError) {
      console.error('❌ Database access error:', usersError);
      return;
    }

    console.log('✅ Database access successful');
    console.log(`Found ${users?.length || 0} users`);

    if (users && users.length > 0) {
      console.log('Sample user data:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email || 'No email'} (${user.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the check
checkUsers(); 