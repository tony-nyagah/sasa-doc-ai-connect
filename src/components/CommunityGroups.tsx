import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Plus, 
  Search,
  Lock,
  Globe
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  condition: string;
  member_count: number;
  is_private: boolean;
  created_at: string;
  is_member?: boolean;
}

const CommunityGroups = () => {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('community_groups')
        .select(`
          *,
          group_members!left(user_id)
        `)
        .order('member_count', { ascending: false });

      if (error) throw error;

      const groupsWithMembership = data?.map(group => ({
        ...group,
        is_member: group.group_members?.some((member: any) => member.user_id === user?.id) || false
      })) || [];

      setGroups(groupsWithMembership);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join groups.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You've joined the group successfully!",
      });

      fetchGroups(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join group. Please try again.",
        variant: "destructive"
      });
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Left group",
        description: "You've left the group successfully.",
      });

      fetchGroups(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave group. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Support Communities</h2>
          <p className="text-gray-600">Connect with others who understand your journey</p>
        </div>
        <Button className="medical-gradient text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search groups by condition or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="medical-card hover:scale-105 transition-transform duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {group.name}
                    {group.is_private ? (
                      <Lock className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Globe className="w-4 h-4 text-green-500" />
                    )}
                  </CardTitle>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {group.condition}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">
                {group.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{group.member_count} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>Active</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <Avatar key={i} className="w-6 h-6 border-2 border-white">
                      <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-xs text-gray-500">+{group.member_count - 3} others</span>
              </div>

              <div className="pt-2">
                {group.is_member ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-medical-primary text-medical-primary"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => leaveGroup(group.id)}
                    >
                      Leave
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full medical-gradient text-white hover:opacity-90"
                    size="sm"
                    onClick={() => joinGroup(group.id)}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    Join Community
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No groups found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a support community'}
            </p>
            <Button className="medical-gradient text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Group
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityGroups;