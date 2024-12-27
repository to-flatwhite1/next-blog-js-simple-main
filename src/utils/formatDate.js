export const formatDate = (date) => {
    // MongoDB의 Date 객체를 로컬 시간으로 변환
    return new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
