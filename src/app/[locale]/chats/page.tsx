import { createClient } from "@/utils/supabase/server"
import { redirect } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { Navigation } from "@/components/navigation"
import { Sparkles, MessageSquare, Clock, ArrowRight, User } from "lucide-react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { giants } from "@/lib/giants-data"

export default async function ChatsPage() {
  const supabase = await createClient()
  const t = await getTranslations("Chats")
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/")
  }

  // Fetch chats for the user from Supabase
  const { data: userChats, error } = await supabase
    .from('chats')
    .select('*, messages(count)')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching chats:', error)
  }

  const chatsWithCount = userChats?.map(chat => ({
    ...chat,
    _count: { messages: chat.messages?.[0]?.count || 0 }
  })) || []

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navigation />
      
      {/* Header Section */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400/80 text-sm font-medium tracking-widest uppercase">{t("subtitle")}</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-light">
            {t("description")}
          </p>
        </div>
      </section>

      {/* Chat List Grid */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          {chatsWithCount.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chatsWithCount.map((chat) => {
                const giant = giants.find(g => g.slug === chat.giantId)
                return (
                  <Link 
                    key={chat.id} 
                    href={`/giant/${chat.giantId}?chatId=${chat.id}`}
                    className="group glass-card rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        {giant?.imageUrl ? (
                          <Image 
                            src={giant.imageUrl} 
                            alt={chat.giantId} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-amber-500/10 flex items-center justify-center">
                            <User className="text-amber-500/50" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-amber-200 transition-colors truncate">
                          {chat.title}
                        </h3>
                        <p className="text-amber-400/80 text-sm font-medium truncate">{giant?.name || chat.giantId}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{chat._count.messages} messages</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(chat.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="glass-card rounded-[2rem] p-20 text-center flex flex-col items-center max-w-4xl mx-auto border-dashed border-white/10">
              <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-8">
                <MessageSquare className="w-10 h-10 text-amber-500/50" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                {t("emptyTitle")}
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-md">
                {t("emptyDescription")}
              </p>
              <Link 
                href="/#giants"
                className="px-8 py-4 rounded-xl bg-amber-500 text-black font-bold hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-1"
              >
                {t("startFirstChat")}
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
