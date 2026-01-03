import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

const ConcertList = () => {
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const searchKeyword = searchParams.get('search') || '';

    const filteredConcerts = concerts.filter((concert) => {
        if (!searchKeyword) return true;
        const keyword = searchKeyword.toLowerCase();
        return (
            concert.title.toLowerCase().includes(keyword) ||
            concert.venue.toLowerCase().includes(keyword)
        );
    });

    useEffect(() => {
        const fetchConcerts = async () => {
            try {
                setLoading(true);
                // 백엔드 API 호출
                const response = await axios.get('/api/v1/concerts');
                setConcerts(response.data);
            } catch (err) {
                console.error("불러오기 실패:", err);
                setError("공연 목록을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchConcerts();
    }, []);

    if (loading) return <div className="text-center py-40 text-gray-500">목록을 불러오는 중...</div>;
    if (error) return <div className="text-center py-40 text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">

            {/* 페이지 타이틀 */}
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                    {searchKeyword ? `"${searchKeyword}" 검색 결과` : '티켓 오픈'} 
                    <span className="text-red-500 text-lg ml-2 font-normal">
                        {searchKeyword ? `${filteredConcerts.length}건` : '전체 목록'}
                    </span>
                </h2>
                <p className="text-gray-500 mt-2">
                    현재 예매 가능한 모든 공연을 확인하세요.
                </p>
            </div>

            {/* 공연 리스트 그리드 */}
            {filteredConcerts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {filteredConcerts.map((concert) => (
                        <Link to={`/concert/${concert.id}`} key={concert.id} className="group">
                            {/* 카드 이미지 */}
                            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                                <img
                                    src={concert.imageUrl}
                                    alt={concert.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* 판매중 뱃지 */}
                                <div className="absolute top-3 left-3 flex gap-1">
                                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                        판매중
                                    </span>
                                </div>
                            </div>

                            {/* 카드 내용 */}
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                                    {concert.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {concert.startDate.split('T')[0]} ~ {concert.endDate.split('T')[0]}
                                </p>
                                <p className="text-xs text-gray-400">
                                    📍 {concert.venue}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center">
                    <p className="text-xl text-gray-400">등록된 공연이 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default ConcertList;