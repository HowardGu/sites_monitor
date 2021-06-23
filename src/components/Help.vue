<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>帮助手册</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="sites-card-header">
                <span>帮助手册</span>
            </div>

            <el-link icon="el-icon-download" type="primary" href="https://www.baidu.com" target="_blank">下载帮助手册</el-link>
        </el-card>
    </div>
</template>
