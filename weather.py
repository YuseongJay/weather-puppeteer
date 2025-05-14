import asyncio
from playwright.async_api import async_playwright
from PIL import Image
import io

async def main():
    async with async_playwright() as p:
        # Launch browser in headed mode for debugging
        browser = await p.chromium.launch(headless=False)
        
        # Create context with iPhone 13 device
        iphone_13 = p.devices['iPhone 13']
        context = await browser.new_context(
            **iphone_13,
            geolocation={'latitude': 37.546549, 'longitude': 127.048458},
            permissions=['geolocation']
        )
        
        # Create new page
        page = await context.new_page()
    
        # Navigate to the weather page
        print("\n=== Navigation ===")
        print("페이지 로딩 중...")
        await page.goto("https://www.weather.go.kr/w/image/vshrt/rain.do", wait_until='networkidle')
        await page.reload()

        # Zoom in multiple times
        print("\n=== Zooming ===")
        for i in range(6):
            print(f"줌 인 {i+1}/6")
            await page.click("button.ol-zoom-in")
            await asyncio.sleep(0.5)
        await asyncio.sleep(1)

        # Click start button
        print("\n=== Animation Start ===")
        await page.click("button.start-btn")
        await page.evaluate("""
            window.scrollTo(0, 100);
        """)
        await asyncio.sleep(0.01)

        # Get page dimensions
        viewport_width = iphone_13['viewport']['width']
        viewport_height = iphone_13['viewport']['height']

        print("\n=== Screenshot Settings ===")
        print(f"Viewport width: {viewport_width}")
        print(f"Viewport height: {viewport_height}")
        print(f"Capture area: {viewport_width}x{viewport_height}")
        print(f"Starting from y: 0")

        # Capture screenshots
        screenshots = []
        print("\n=== Capturing Screenshots ===")
        for i in range(7):
            print(f"스크린샷 {i+1}/7 캡처 중...")
            screenshot = await page.screenshot(
                scale='css',
                clip={
                    'x': 0,
                    'y': 0,
                    'width': viewport_width,
                    'height': viewport_height
                }
            )
            image = Image.open(io.BytesIO(screenshot))
            screenshots.append(image)
            await asyncio.sleep(0.5)

        print("\n=== Creating GIF ===")
        # Save screenshots as an animated GIF
        if screenshots:
            # Save the first image as GIF and append the rest
            screenshots[0].save(
                'weather.gif',
                save_all=True,
                append_images=screenshots[1:],
                duration=500,  # 각 프레임 간 시간 간격 (밀리초)
                loop=0  # 0은 무한 반복
            )
            print("GIF 파일이 생성되었습니다: weather.gif")
        else:
            print("스크린샷이 없어 GIF를 생성할 수 없습니다.")

        # Close browser
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main()) 
