<template>
  <div class="main-content">
    <div style="overflow: hidden">
      <div class="form-left">
        <div class="form-box">
          标签：
          <a-select
            style="min-width: 200px;margin-right:10px"
            placeholder="标签"
            v-model="label"
            allowClear
            @change="labelChange"
          >
            <a-select-option v-for="i in labelList" :key="i.label">
              {{ i.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="form-right">
        <!--        <a-button type="primary" icon="plus" @click="addVisible = true" style="margin-right: 10px">-->
        <!--          添加标签-->
        <!--        </a-button>-->
        <a-button type="primary" icon="plus" @click="addVisible = true">
          添加
        </a-button>
      </div>
    </div>

    <div class="table-box">
      <a-table
        :columns="columns"
        :data-source="data"
        :loading="tableLoading"
        :pagination="false"
      >
        <!-- 类型 -->
        <template slot="label" slot-scope="text">
          {{ text }}
        </template>
        <!-- 预览图 -->
        <template slot="url" slot-scope="text">
          <img :src="text" class="preview-img" @click="onCheckListImg(text)" />
        </template>
        <!-- 操作按钮 -->
        <template slot="operate" slot-scope="text, record">
          <a-button
            size="small"
            style="margin-right: 10px"
            @click="operateBtn(record, 1)"
          >
            编辑
          </a-button>
          <a-button type="danger" size="small" @click="operateBtn(record, 2)">
            删除
          </a-button>
        </template>
      </a-table>
    </div>
    <!-- 添加数据 对话框 -->
    <a-modal
      :title="addTitle"
      :visible="addVisible"
      :confirm-loading="addConfirmLoading"
      @ok="addOk"
      @cancel="addCancel"
      :width="700"
    >
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="标签">
          <a-select
            v-decorator="[
              'label',
              {
                rules: [{ required: true, message: '请选择标签！' }]
              }
            ]"
            mode="multiple"
            style="width: 200px"
            placeholder="标签"
          >
            <a-select-option v-for="i in labelList" :key="i.label">
              {{ i.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="地址">
          <a-textarea
            placeholder="图片地址"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            v-decorator="[
              'url',
              {
                rules: [{ required: true, message: '请输入地址！' }]
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 查看大图 -->
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="previewVisibleCancel"
    >
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import {
  pictureList,
  labelList,
  createPicture,
  updatePicture,
  DeletePicture
} from "@/request/api";
// import moment from "moment/moment";
export default {
  name: "picture-manage",
  components: {},
  data() {
    return {
      addVisible: false,
      addTitle: "添加数据",
      tableLoading: false,
      addConfirmLoading: false,
      form: this.$form.createForm(this),
      previewVisible: false, //查看大图 状态
      previewImage: "", //查看大图地址
      columns: [
        {
          title: "标签",
          dataIndex: "label",
          key: "label",
          width: "20%"
        },
        {
          title: "预览图",
          dataIndex: "url",
          key: "url",
          scopedSlots: { customRender: "url" },
          width: "15%"
        },
        // {
        //   title: "地址",
        //   dataIndex: "url",
        //   key: "url2",
        //   scopedSlots: { customRender: "url2" },
        //   width: "50%"
        // },
        {
          title: "创建时间",
          dataIndex: "add_time",
          scopedSlots: { customRender: "add_time" },
          key: "add_time",
          width: "50%"
        },
        {
          title: "操作",
          dataIndex: "operate",
          key: "operate",
          scopedSlots: { customRender: "operate" },
          fixed: "right",
          width: "140"
        }
      ],
      data: [], //表格数据
      editid: "", //编辑id
      labelList: [],
      label: []
    };
  },
  created() {
    this.getLabelList();
    this.getList();
  },
  methods: {
    labelChange() {
      this.getList();
    },
    getList() {
      this.tableLoading = true;
      let label = this.label;
      let data = { where_id: "GE-1", order: ["id DESC"] };
      if (label) {
        data.where_label = "LIKE-" + label;
      }
      pictureList(data).then(res => {
        if (res.data.err_code === 0) {
          this.data = res.data.list;
        } else {
          this.$message.success(res.data.err_msg);
        }
        this.tableLoading = false;
      });
    },
    getLabelList() {
      labelList({ page: 1, perpage: 100 }).then(res => {
        if (res.data.err_code === 0) {
          this.labelList = res.data.list;
        } else {
          this.$message.success(res.data.err_msg);
        }
      });
    },
    addCancel() {
      this.emptyForm();
    },
    addOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.addConfirmLoading = true;
          let fn = createPicture,
            parameter = { data: {} };
          values.label = values.label.join(",");
          if (this.editid) {
            parameter.where = `[["id", "=", "${this.editid}"]]`;
            fn = updatePicture;
          }
          parameter.data = JSON.stringify(values);
          fn(parameter).then(res => {
            if (res.data.err_code === 0) {
              this.$message.success(this.editid ? "编辑成功！" : "添加成功！");
              this.emptyForm();
              this.getList();
            } else {
              this.$message.error(res.data.err_msg);
            }
          });
        }
      });
    },
    //清空表单
    emptyForm() {
      this.form.resetFields();
      this.editid = "";
      this.addVisible = false;
      this.addConfirmLoading = false;
    },

    previewVisibleCancel() {
      this.previewVisible = false;
    },
    onCheckListImg(item) {
      this.previewVisible = true;
      this.previewImage = item;
    },
    operateBtn(item, type) {
      if (type === 1) {
        //编辑
        this.addVisible = true;
        this.addTitle = "编辑数据";
        this.editid = item.id;
        setTimeout(() => {
          this.form.setFieldsValue({
            ...item,
            label: item.label.split(",")
          });
        }, 300);
      } else {
        //删除
        let taht = this;
        this.$confirm({
          title: "删除",
          content: "确定删除这条数据？",
          okText: "是",
          okType: "danger",
          cancelText: "否",
          onOk() {
            DeletePicture({
              id: item.id
            }).then(res => {
              if (res.data.err_code === 0) {
                taht.$message.success("删除成功！");
                taht.addVisible = false;
                taht.getList();
              } else {
                taht.$message.error(res.data.err_msg);
              }
            });
          },
          onCancel() {}
        });
        return;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.t {
  display: inline-block;
  vertical-align: middle;
}
.form-box {
  min-width: 200px;
  .t();
}
.picker-box {
  margin-right: 10px;
  .t();
}
.main-content {
  overflow: hidden;
  min-height: 300px;
}
.form-left {
  width: 60%;
  float: left;
}
.form-right {
  width: 40%;
  float: right;
  text-align: right;
}
/deep/ .ant-form-item {
  margin: 0 0 10px !important;
}
.preview-list {
  display: inline-block;
  vertical-align: super;
  .item-box {
    display: inline-block;
    position: relative;
    .delect {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 18px;
      color: #fff;
      cursor: pointer;
      &:hover {
        color: red;
      }
    }
  }
  img {
    width: 102px;
    height: 102px;
    margin: 0 5px 5px 0;
    border-radius: 4px;
    cursor: pointer;
  }
}
/deep/ .ant-upload-picture-card-wrapper {
  vertical-align: bottom;
  width: auto;
}
/deep/ .ant-table-row-cell-break-word {
  padding: 10px 16px;
}
.table-box {
  padding-top: 20px;
  min-height: 333px;
  .preview-img {
    width: 50px;
    height: 50px;
    margin: 0 5px 5px 0;
  }
  .link {
    color: #4897f8;
  }
}
</style>
