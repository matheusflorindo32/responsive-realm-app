import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Perfil() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", u.user.id).single();
      setProfile(data ?? { user_id: u.user.id });
      setLoading(false);
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("profiles").upsert(profile, { onConflict: "user_id" });
    if (error) return toast.error(error.message);
    toast.success("Perfil salvo");
  };

  if (loading) return <p className="text-muted-foreground">Carregando…</p>;

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meu perfil</h1>
        <p className="text-muted-foreground">Ajuste seus dados. Perfis são privados por padrão.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Dados</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-1.5"><Label>Nome</Label><Input value={profile.display_name ?? ""} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Bio</Label><Textarea rows={3} value={profile.bio ?? ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Cidade</Label><Input value={profile.city ?? ""} onChange={(e) => setProfile({ ...profile, city: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Avatar (URL)</Label><Input value={profile.avatar_url ?? ""} onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })} /></div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label className="cursor-pointer">Perfil público</Label>
                <p className="text-xs text-muted-foreground">Torna seu perfil visível para outros usuários.</p>
              </div>
              <Switch checked={!!profile.is_public} onCheckedChange={(v) => setProfile({ ...profile, is_public: v })} />
            </div>
            {profile.is_public && (
              <div className="space-y-1.5"><Label>Slug público</Label><Input value={profile.public_slug ?? ""} onChange={(e) => setProfile({ ...profile, public_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} /></div>
            )}
            <Button type="submit">Salvar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
