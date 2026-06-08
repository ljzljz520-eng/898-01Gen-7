import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import SpecialCard from '@/components/SpecialCard';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';

export default function SpecialList() {
  const { specials, loading, fetchSpecials } = useStore();

  useEffect(() => {
    fetchSpecials(true);
  }, [fetchSpecials]);

  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="bg-gradient-primary text-white">
        <div className="container px-4 py-8">
          <h1 className="text-3xl font-bold font-display mb-2">节日专题</h1>
          <p className="text-white/80">精选节日美食，让每个节日都有美味相伴</p>
        </div>
        <div className="h-8 bg-gradient-warm rounded-t-3xl" />
      </div>

      <div className="container px-4 py-6">
        {loading ? (
          <Loading />
        ) : specials.length === 0 ? (
          <Empty text="暂无节日专题" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specials.map((special) => (
              <SpecialCard key={special.id} special={special} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
