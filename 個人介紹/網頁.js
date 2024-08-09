document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('theme-toggle');

    // 检查本地存储中的主题设置
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(currentTheme + '-theme');

    toggleButton.addEventListener('click', function() {
        // 切换主题
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });
});
function updateTime() {
    const now = new Date();
    
    const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    
    const day = now.getDate();
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const dayOfWeek = daysOfWeek[now.getDay()];
    
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    const dateString = `${year}年${month}${day}日（${dayOfWeek}）`;
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    document.getElementById('clock').innerHTML = `${dateString}<br>${timeString}`;
}

// 每秒更新一次時間
setInterval(updateTime, 1000);

// 初始化顯示時間
updateTime();
