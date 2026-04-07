from playwright.sync_api import sync_playwright
import os

def run_mobile_test(page):
    # Set viewport to mobile
    page.set_viewport_size({"width": 375, "height": 667})

    # Wait for the dev server to be ready
    for _ in range(10):
        try:
            page.goto("http://localhost:3000")
            break
        except:
            page.wait_for_timeout(2000)

    page.wait_for_timeout(3000)

    # Take screenshot of mobile initial state
    page.screenshot(path="/home/jules/verification/screenshots/mobile_initial.png")

    # Check if the hamburger menu button is visible
    hamburger = page.get_by_role("button", name="Open categories")
    if hamburger.is_visible():
        print("Hamburger button is visible")
        hamburger.click()
        page.wait_for_timeout(1000)
        page.screenshot(path="/home/jules/verification/screenshots/mobile_sidebar_open.png")
    else:
        print("Hamburger button is NOT visible")

if __name__ == "__main__":
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            run_mobile_test(page)
        finally:
            context.close()
            browser.close()
