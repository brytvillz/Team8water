#!/usr/bin/env python3
"""
Image Compression Script for Crop8Hub
This script compresses large images to improve website loading speed
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
    import PIL.Image
except ImportError:
    print("❌ Pillow library not found!")
    print("Installing Pillow...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image
    import PIL.Image

# Configuration
MAX_WIDTH = 1920  # Maximum width for hero images
MAX_HEIGHT = 1080  # Maximum height for hero images
QUALITY = 85  # JPEG quality (0-100, 85 is good balance)
IMAGE_DIR = "images"

# Image files to compress
IMAGES_TO_COMPRESS = [
    "hero image1.jpg",
    "hero image2.jpg",
    "hero image3.jpg",
    "needs bg-image.jpg",
    "categories BGimage.jpg",
    "about us image.jpg",
    "card-slide1.jpg",
    "card-slide2.jpg",
    "card-slide3.jpg",
    "card-slide4.jpg",
]

def get_file_size(filepath):
    """Get file size in MB"""
    size_bytes = os.path.getsize(filepath)
    return size_bytes / (1024 * 1024)

def compress_image(input_path, output_path=None, max_width=MAX_WIDTH, max_height=MAX_HEIGHT, quality=QUALITY):
    """
    Compress and resize image
    """
    if output_path is None:
        output_path = input_path
    
    try:
        # Open image
        with Image.open(input_path) as img:
            original_size = get_file_size(input_path)
            original_dimensions = img.size
            
            # Convert to RGB if necessary (handles PNG with transparency)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize if image is too large
            if img.width > max_width or img.height > max_height:
                img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
            
            # Save with optimization
            img.save(
                output_path,
                'JPEG', 
                quality=quality,
                optimize=True,
                progressive=True  # Progressive JPEGs load faster
            )
            
            new_size = get_file_size(output_path)
            reduction = ((original_size - new_size) / original_size) * 100
            
            print(f"✅ {os.path.basename(input_path)}")
            print(f"   Original: {original_dimensions[0]}x{original_dimensions[1]} ({original_size:.2f}MB)")
            print(f"   Compressed: {img.size[0]}x{img.size[1]} ({new_size:.2f}MB)")
            print(f"   Reduced by: {reduction:.1f}%\n")
            
            return True
            
    except Exception as e:
        print(f"❌ Error compressing {input_path}: {str(e)}")
        return False

def main():
    """Main compression function"""
    print("🖼️  Crop8Hub Image Compression Tool")
    print("=" * 50)
    print(f"Target directory: {IMAGE_DIR}")
    print(f"Max dimensions: {MAX_WIDTH}x{MAX_HEIGHT}")
    print(f"Quality: {QUALITY}%")
    print("=" * 50)
    print()
    
    # Check if images directory exists
    if not os.path.exists(IMAGE_DIR):
        print(f"❌ Directory '{IMAGE_DIR}' not found!")
        return
    
    # Create backup directory
    backup_dir = os.path.join(IMAGE_DIR, "originals_backup")
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        print(f"📁 Created backup directory: {backup_dir}\n")
    
    total_saved = 0
    compressed_count = 0
    
    # Compress each image
    for image_name in IMAGES_TO_COMPRESS:
        image_path = os.path.join(IMAGE_DIR, image_name)
        
        if not os.path.exists(image_path):
            print(f"⚠️  File not found: {image_name}")
            continue
        
        # Backup original
        backup_path = os.path.join(backup_dir, image_name)
        if not os.path.exists(backup_path):
            import shutil
            shutil.copy2(image_path, backup_path)
        
        original_size = get_file_size(image_path)
        
        # Compress
        if compress_image(image_path):
            new_size = get_file_size(image_path)
            total_saved += (original_size - new_size)
            compressed_count += 1
    
    # Summary
    print("=" * 50)
    print(f"✨ Compression Complete!")
    print(f"   Files compressed: {compressed_count}/{len(IMAGES_TO_COMPRESS)}")
    print(f"   Total space saved: {total_saved:.2f}MB")
    print(f"   Originals backed up to: {backup_dir}")
    print("=" * 50)
    print()
    print("💡 Tips for hosting:")
    print("   1. Enable gzip/brotli compression on your server")
    print("   2. Use a CDN for faster image delivery")
    print("   3. Enable browser caching for images")
    print("   4. Consider WebP format for even better compression")

if __name__ == "__main__":
    main()
