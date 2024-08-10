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

document.addEventListener('DOMContentLoaded', function () {
    function checkVisibility() {
        const sections = document.querySelectorAll('.hidden-section');
        const fadeOutBuffer = 100;  // 用于稍微延迟消失的缓冲区

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();

            // 当元素进入视口时显示
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.classList.add('visible');
                section.classList.remove('invisible');
            }

            // 当元素离开视口时消失
            if (rect.top + fadeOutBuffer < 0 || rect.bottom - fadeOutBuffer > window.innerHeight) {
                section.classList.add('invisible');
                section.classList.remove('visible');
            }
        });
    }

    // 初次加载时检查
    checkVisibility();

    // 滚动时检查
    window.addEventListener('scroll', checkVisibility);
});
