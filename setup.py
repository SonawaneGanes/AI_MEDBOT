from setuptools import setup, find_packages

setup(
    name="medbot",
    version="0.1.0",
    packages=find_packages(exclude=("tests", "docs")),
    include_package_data=True,
    description="Local medbot package for project configuration",
    author="",
)
