import { Modal, Input, Form, InputNumber, Select } from 'antd';


interface IProps {
    access_token: string
    isCreateModalOpen: boolean
    setIsCreateModalOpen: (v: boolean) => void
    openNotification: (status: boolean, message: string, text?: string[]) => void
    getData: () => void
}

export type UserType = {
    name: string;
    email: string;
    password?: string;
    age: string;
    gender: string;
    address: string;
    role: string;
};

const CreateUserModal = (props: IProps) => {
    const [form] = Form.useForm();

    const { access_token, isCreateModalOpen, setIsCreateModalOpen, openNotification, getData } = props

    const onFinish = async (values: any) => {
        const {
            name, email, password, age, gender, address, role
        } = values

        const data = {
            name, email, password, age, gender, address, role
        }

        const res = await fetch("http://localhost:8000/api/v1/users", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${access_token}`
            },
            body: JSON.stringify(data)
        })

        const d = await res.json()

        setIsCreateModalOpen(false)

        if (d.data) {
            openNotification(true, d.message)
        } else {
            openNotification(false, "Có lỗi xảy ra", d.message)
        }

        getData()
    };

    const handleCancel = async () => {
        setIsCreateModalOpen(false)
        form.resetFields()
    };


    return (
        <Modal
            title="Update user"
            centered
            maskClosable={false}
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCancel()}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Form.Item<UserType>
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<UserType>
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<UserType>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item<UserType>
                    label="Age"
                    name="age"
                    rules={[{ required: true, message: 'Please input your age!' }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item<UserType>
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: 'Please input your gender!' }]}
                >
                    <Select>
                        <Select.Option value="Male">Male</Select.Option>
                        <Select.Option value="Female">Female</Select.Option>
                        <Select.Option value="Other">Other</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item<UserType>
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please input your address!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<UserType>
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: 'Please input your role!' }]}
                >
                    <Select>
                        <Select.Option value="User">User</Select.Option>
                        <Select.Option value="Admin">Admin</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default CreateUserModal