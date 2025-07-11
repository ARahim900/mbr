import { supabase } from '../services/supabaseClient';

interface LocalUser {
  user: {
    id: string;
    username: string;
    fullName: string;
    email?: string;
    department: string;
    role: string;
  };
  password: string;
}

async function checkRegisteredUsers() {
  console.log('🔍 Checking registered users...\n');

  // Check Supabase configuration
  console.log('📝 Supabase Configuration:');
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'NOT_CONFIGURED';
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'NOT_CONFIGURED';
  
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);
  console.log('');

  // Check localStorage users (fallback storage)
  console.log('💾 LocalStorage Users:');
  try {
    const localUsers = JSON.parse(localStorage.getItem('mbr_registered_users') || '{}');
    const userCount = Object.keys(localUsers).length;
    
    if (userCount === 0) {
      console.log('   No users found in localStorage');
    } else {
      console.log(`   Found ${userCount} users in localStorage:`);
      Object.entries(localUsers).forEach(([username, userData]: [string, any]) => {
        const user = userData.user;
        console.log(`   - ${username}: ${user.fullName} (${user.email || 'no email'}) - ${user.role}`);
      });
    }
  } catch (error) {
    console.log('   Error reading localStorage:', error);
  }
  console.log('');

  // Check current logged-in user
  console.log('👤 Currently Logged In:');
  try {
    const currentUser = JSON.parse(localStorage.getItem('mbr_user') || 'null');
    if (currentUser) {
      console.log(`   User: ${currentUser.username} (${currentUser.fullName})`);
      console.log(`   Role: ${currentUser.role}`);
      console.log(`   Email: ${currentUser.email || 'not set'}`);
    } else {
      console.log('   No user currently logged in');
    }
  } catch (error) {
    console.log('   Error reading current user:', error);
  }
  console.log('');

  // Check Supabase users (if configured)
  console.log('🗄️  Supabase Database Users:');
  
  if (supabaseUrl === 'NOT_CONFIGURED' || supabaseKey === 'NOT_CONFIGURED') {
    console.log('   ⚠️  Supabase not configured. Please set up environment variables:');
    console.log('   1. Create a .env file in your project root');
    console.log('   2. Add your Supabase credentials:');
    console.log('      REACT_APP_SUPABASE_URL=your-project-url');
    console.log('      REACT_APP_SUPABASE_ANON_KEY=your-anon-key');
    console.log('   3. Run the SQL setup script in your Supabase dashboard');
    console.log('   📖 See SUPABASE_SETUP_GUIDE.md for detailed instructions');
  } else {
    try {
      // Check if we can connect to Supabase
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log('   ❌ Error connecting to Supabase:', sessionError.message);
        console.log('   Please check your credentials and network connection');
      } else {
        console.log('   ✅ Successfully connected to Supabase');
        
        // Try to fetch user profiles
        const { data: profiles, error: profileError } = await supabase
          .from('user_profiles')
          .select('username, full_name, email, department, role, created_at')
          .order('created_at', { ascending: false });

        if (profileError) {
          console.log('   ❌ Error fetching user profiles:', profileError.message);
          console.log('   This might mean:');
          console.log('   - The user_profiles table doesn\'t exist');
          console.log('   - RLS policies are blocking access');
          console.log('   - The SQL setup script wasn\'t run');
          console.log('   📖 Check the SUPABASE_SETUP_GUIDE.md for setup instructions');
        } else if (!profiles || profiles.length === 0) {
          console.log('   📭 No users found in Supabase database');
          console.log('   This is normal if you haven\'t registered any users through Supabase yet');
        } else {
          console.log(`   📊 Found ${profiles.length} users in Supabase:`);
          profiles.forEach((profile, index) => {
            console.log(`   ${index + 1}. ${profile.username}: ${profile.full_name}`);
            console.log(`      Email: ${profile.email}`);
            console.log(`      Department: ${profile.department}`);
            console.log(`      Role: ${profile.role}`);
            console.log(`      Registered: ${new Date(profile.created_at).toLocaleDateString()}`);
            console.log('');
          });
        }

        // Check auth users
        console.log('   🔐 Supabase Auth Users:');
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.log('   ❌ Cannot access auth users (admin access required)');
          console.log('   This is normal - auth user list requires admin privileges');
        } else if (authUsers.users.length === 0) {
          console.log('   📭 No auth users found');
        } else {
          console.log(`   👥 Found ${authUsers.users.length} authenticated users`);
        }
      }
    } catch (error) {
      console.log('   ❌ Unexpected error checking Supabase:', error);
    }
  }

  console.log('\n📋 Summary:');
  console.log('===========');
  console.log('• Demo users are always available (admin/admin123, manager/manager123, operator/operator123)');
  console.log('• LocalStorage users work as fallback when Supabase is not configured');
  console.log('• Supabase users provide persistent, secure authentication');
  console.log('• Check SUPABASE_SETUP_GUIDE.md for complete setup instructions');
  
  if (supabaseUrl === 'NOT_CONFIGURED') {
    console.log('\n⚠️  Next Steps:');
    console.log('1. Set up your Supabase project and get credentials');
    console.log('2. Create .env file with your Supabase URL and key');
    console.log('3. Run the SQL setup script in Supabase dashboard');
    console.log('4. Test registration and login with Supabase');
  }
}

// Export for use in other files
export { checkRegisteredUsers };

// If running directly (not imported)
if (typeof window !== 'undefined') {
  // Browser environment - can be called from console
  (window as any).checkUsers = checkRegisteredUsers;
  console.log('✅ User checker loaded. Run checkUsers() in the console to check registered users.');
} else {
  // Node environment - run directly
  checkRegisteredUsers().catch(console.error);
} 