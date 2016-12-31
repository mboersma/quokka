deploymentname = "mydeployment"
mydeployment = {
    "kind": "Deployment",
    "apiVersion": "extensions/v1beta1",
    "metadata": {
        "name": deploymentname,
        "namespace": "default",
        "labels": {
            "heritage": "Quokka",
        },
    },
    "spec": {
      "replicas": 1,
      "selector": {"app": "nginx"},
      "template": {
        "metadata": {"name": "nginx"},
        "spec": {
          "containers": [
              {
                  "name": "waiter",
                  "image": "alpine:3.3",
                  "command": [
                      "/bin/sleep",
                      "9000"
                  ],
                  "imagePullPolicy": "IfNotPresent"
              }
          ]
        }
      }
    }
};


res = kubernetes.deployment.create(mydeployment)
if (res.metadata.name != deploymentname) {
	throw "expected deployment named " + deploymentname
}

// Get our new deployment by name
pp = kubernetes.deployment.get(deploymentname)
if (pp.metadata.name != deploymentname) {
	throw "unexpected deployment name: " + pp.metadata.name
}

// Search for our new deployment.
matches = kubernetes.deployment.list({labelSelector: "heritage = Quokka"})
if (matches.items.length == 0) {
	throw "expected at least one deployment in list"
}

// Update the deployment
res.metadata.annotations = {"foo": "bar"}
res2 = kubernetes.deployment.update(res)
if (res2.metadata.annotations.foo != "bar") {
	throw "expected foo annotation"
}

kubernetes.deployment.delete(deploymentname, {})
kubernetes.deployment.deleteCollection({}, {labelSelector: "heritage=Quokka"})
